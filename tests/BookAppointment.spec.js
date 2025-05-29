// bookappointment.spec.js
const { test, expect } = require('@playwright/test');
const { setupSteps, Navigationtoappointment, NavigationtoQuerypage } = require('./Setup');
const { WaitPage } = require('./Waitpage'); 
const { postalcode,numbersequential,accederbutton } = require('./envActions');

test.describe('Appointment Tests', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env;
    await setupSteps(page);
    await NavigationtoQuerypage(page,env);
    await Navigationtoappointment(page, env);
  });

  test('Appointment for orphan', async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env;
    await fillPatientDetails(page, env, {
      lastName: 'Tinkle',
      firstName: 'Ivana',
      phone: '(798) 901-3720',
      ramq: 'TINI92611289',
      sequence: '1',
      day: '12',
      month: '11',
      year: '1992',
      gender: 'female'
    });
    await completeAppointment(page,env);
  });

  test('Appointment with family doctor', async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env;
    await fillPatientDetails(page, env, {
      lastName: 'Vos-Sept',
      firstName: 'Patient',
      phone: '(798) 901-3720',
      ramq: 'VOSP92010107',
      sequence: '1',
      day: '1',
      year: '1992',
      gender: 'male'
    });
    await completeAppointment(page,env);
  });

  test('Appointment with clinic', async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env;
    await fillPatientDetails(page, env, {
      lastName: 'Vos-Huit',
      firstName: 'Patient',
      phone: '(798) 901-3720',
      ramq: 'VOSP92510108',
      sequence: '1',
      day: '1',
      year: '1992',
      gender: 'female'
    });
    await completeAppointment(page,env);
  });
});

async function fillPatientDetails(page, env, data) {
  await page.getByRole('textbox', { name: 'Nom de famille' }).fill(data.lastName);
  await page.getByRole('textbox', { name: 'Prénom' }).fill(data.firstName);
  await page.getByRole('textbox', { name: 'Numéro de téléphone' }).fill(data.phone);
  await page.getByRole('textbox', { name: "Numéro d'assurance maladie" }).fill(data.ramq);
  await numbersequential(page, env);
  await page.getByRole('spinbutton', { name: 'Jour' }).fill(data.day);
  if (data.month) await page.getByLabel('Mois').selectOption(data.month);
  await page.getByRole('spinbutton', { name: 'Année' }).fill(data.year);
  await page.getByLabel('Genre').selectOption(data.gender);
  await postalcode(page, env);
}

async function completeAppointment(page,env) {
  await accederbutton(page, env);
  await page.waitForTimeout(20000);
  // Check if appointments are available by looking for the first selector
const appointmentLocator = page.locator('div.card-body span.lnr.lnr-store').first();
const isAppointmentAvailable = await appointmentLocator.isVisible();

if (isAppointmentAvailable) {
  // Click the appointment selector
  await appointmentLocator.click();

  // Handle the "Suivant" (Continue) button
  const continuerButton = await page.getByRole('button', { name: 'Suivant' });
  const initialUrl = page.url();
  await continuerButton.click();
  await page.waitForTimeout(20000); // Prefer waitForLoadState over waitForTimeout

  const currentUrl = page.url();
  const hasPageChanged = currentUrl !== initialUrl;
  if (!hasPageChanged) {
    console.log('No page change detected, clicking Continuer again');
    await continuerButton.click();
  } else {
    console.log('Page changed, no second click needed');
  }

  // Wait for the confirmation button and click it
  await page.getByRole('button', { name: 'Confirmer le rendez-vous' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Confirmer le rendez-vous' }).click();

  // Wait for confirmation and validate
  const confirmationHeader = page.locator('text=Rendez-vous confirmé!');
  await confirmationHeader.waitFor({ state: 'visible' });
  await expect(confirmationHeader).toHaveText('Rendez-vous confirmé!');
} else {
  // Validate the URL for no appointments
  const noAppointmentUrl = `https://votre-sante-${env}.powerappsportals.com/fr-FR/NoAppointment_available/`;//url differ based on evironments
  await expect(page).toHaveURL(noAppointmentUrl); 
}
}
