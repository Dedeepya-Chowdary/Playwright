const { test, expect } = require('@playwright/test');
const { setupSteps, Navigationtoappointment, NavigationtoQuerypage } = require('./Setup');
const { WaitPage } = require('./Waitpage'); 
const { loadPatientData, loadAllPatientData } = require('./Dataloader'); 

const appointmentMap = {
  'dev-orphan': 0,  'dev-familydoc': 1,  'dev-clinic': 2,  'dev-renew': 3,
  'test-orphan': 4, 'test-familydoc': 5, 'test-clinic': 6, 'test-renew': 7,
  'uat-orphan': 8,  'uat-familydoc': 9,  'uat-clinic': 10, 'uat-renew': 11,
  'int-orphan': 12, 'int-familydoc': 13, 'int-clinic': 14, 'int-renew': 15
};

function getAppointmentIndex(env, testKey) {
  const key = `${env}-${testKey}`;
  const index = appointmentMap[key];
  if (index === undefined) {
    throw new Error(`No appointment index defined for key: ${key}`);
  }
  return index;
}


test.describe('Appointment Tests', () => {
  let patientData;

  test.beforeAll(async ({}, testInfo) => {
    const env = testInfo.project.metadata.env || 'dev';
    patientData = loadAllPatientData(env);
  });

  test.beforeEach(async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env || 'dev';
    await setupSteps(page);
    await NavigationtoQuerypage(page, env);
    //await Navigationtoappointment(page, env);
  });

  test('Renew Appointment', async ({ page },testInfo) => {
    const env = testInfo.project.metadata.env;
    // Create a new browser context
    const waitPage = new WaitPage(page);
    await page.locator('#txtSearch').fill('streptocoque');
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByText('Oui', { exact: true }).click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.locator('#divResp').getByText('Non').click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.getByText('Entre 15 ans et 44 ans').click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.locator('#divResp').getByText('Non').click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.getByText('Oui', { exact: true }).click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.locator('#divResp').getByText('Non').click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.locator('#divResp').getByText('Non').click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.getByText('5 jours').click();
    await page.getByRole('button', { name: 'Suivant' }).click();
    await page.getByRole('button', { name: 'Voir d\'autres options' }).click();
    await page.waitForTimeout(20000);
    await page.getByText('Voir d\'autres options').click();
    await page.waitForTimeout(20000);
    await page.getByText('Voir les rendez-vous').click();
    const patient = patientData.renew;
    const index = getAppointmentIndex(env, 'renew');
    await fillPatientDetails(page, env, patient);
    await completeAppointment(page, env, index);
  });
});

async function fillPatientDetails(page, env, data) {
  await page.getByRole('textbox', { name: 'Nom de famille' }).fill(data.lastName);
  await page.getByRole('textbox', { name: 'Prénom' }).fill(data.firstName);
  await page.getByRole('textbox', { name: 'Numéro de téléphone' }).fill(data.phone);
  await page.getByRole('textbox', { name: "Numéro d'assurance maladie" }).fill(data.ramq);
  await page.locator('#txtSeq').fill('1');
  await page.getByRole('spinbutton', { name: 'Jour' }).fill(data.day);
  if (data.month) await page.getByLabel('Mois').selectOption(data.month);
  await page.getByRole('spinbutton', { name: 'Année' }).fill(data.year);
  await page.getByLabel('Genre').selectOption(data.gender);
  await page.getByRole('textbox', { name: 'Code Postal' }).fill('G8Z1X3');
}

async function completeAppointment(page, env, index) {
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.waitForTimeout(20000);

  const appointmentLocator = page.locator('.appointment-card').nth(index);
  const isAppointmentAvailable = await appointmentLocator.isVisible();

  if (isAppointmentAvailable) {
    await appointmentLocator.click();

    const continuerButton = page.getByRole('button', { name: 'Suivant' });
    const initialUrl = page.url();

    await continuerButton.click();
    await page.waitForTimeout(20000);

    const currentUrl = page.url();
    const hasPageChanged = currentUrl !== initialUrl;

    if (!hasPageChanged) {
      console.log('No page change detected, clicking Continuer again');
      await continuerButton.click();
    } else {
      console.log('Page changed, no second click needed');
    }

    await page.waitForTimeout(180000);
    await page.waitForSelector('text="Continuer sur la page"', { timeout: 190000 });
    await page.click('text="Continuer sur la page"');
    await page.getByRole('button', { name: 'Confirmer le rendez-vous' }).click();
    await page.waitForTimeout(20000);

    const confirmationHeader = page.locator('text=Rendez-vous confirmé!');
    await expect(confirmationHeader).toHaveText('Rendez-vous confirmé!');
  } else {
    await page.waitForTimeout(30000);
    const confirmationHeader = page.locator('text=Rendez-vous disponibles');
    await expect(confirmationHeader).toHaveText('Rendez-vous disponibles');
  }
}