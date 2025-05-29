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

  test('Renew Appointment', async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env;
    await page.getByRole('textbox', { name: 'Nom de famille' }).fill('Vos-Sept');
    await page.getByRole('textbox', { name: 'Prénom' }).fill('Patient');
    await page.getByRole('textbox', { name: 'Numéro de téléphone' }).fill('(798) 901-3720');
    await page.getByRole('textbox', { name: 'Numéro d\'assurance maladie' }).fill('VOSP92010107');
    await numbersequential(page, env);
    await page.getByRole('spinbutton', { name: 'Jour' }).fill('1');
    await page.getByRole('spinbutton', { name: 'Année' }).fill('1992');
    await page.getByLabel('Genre').selectOption('male');
    await postalcode(page, env);
    await accederbutton(page, env);
    await page.locator('div.card-body span.lnr.lnr-store').first().click();
    const continuerButton = await page.getByRole('button', { name: 'Suivant' });
    const initialUrl = page.url();// if contiuner button needs 2 clicks to contiune
    await continuerButton.click();
    await page.waitForTimeout(10000);
    const currentUrl = page.url();
    const hasPageChanged = currentUrl !== initialUrl;
    if (!hasPageChanged) {
      console.log('No page change detected, clicking Continuer again');
      await continuerButton.click();
    } else {
      console.log('Page changed, no second click needed');
    }
    // Wait for 3 minutes (180,000 milliseconds) for the popup to appear
    await page.waitForTimeout(180000);
    // Alternatively, wait for the popup to appear by checking for a selector
    await page.waitForSelector('text="Continuer sur la page"', { timeout: 190000 });
    // Click the "Continuer sur la page" button
    await page.click('text="Continuer sur la page"');
    await page.getByRole('button', { name: 'Confirmer le rendez-vous' }).click();
    await page.waitForTimeout(20000); // Adjust timeout as needed
    const confirmationHeader = page.locator('text=Rendez-vous confirmé!');
    await expect(confirmationHeader).toHaveText('Rendez-vous confirmé!');
  });
});