const { test, expect } = require('@playwright/test');
const { setupSteps } = require('./Setup'); // import navigation steps
const { WaitPage } = require('./Waitpage');
const {postalcode}= require('./envActions'); 

test.describe('Cancel Appointment Tests', () => {

   test.beforeEach(async ({ page }) => {
    await setupSteps(page);// Call the nvigation steps before each test
  });
  
  test('Cancel Appointment', async ({ page },testInfo) => {
    const env = testInfo.project.metadata.env;
    const waitPage = new WaitPage(page);
    await page.getByText('Rendez-vous pris Consultez ou').click();
    await page.getByRole('textbox', { name: 'Nom de famille' }).fill('Vos-Sept');
    await page.getByRole('textbox', { name: 'Prénom' }).fill('Patient');
    await page.getByRole('textbox', { name: 'Numéro de téléphone' }).fill('(798) 901-3720');
    await page.getByRole('textbox', { name: 'Numéro d\'assurance maladie' }).fill('VOSP92010107');
    await page.getByRole('textbox', { name: 'Numero sequentiel' }).fill('1');
    await page.getByRole('spinbutton', { name: 'Jour' }).fill('1');
    await page.getByRole('spinbutton', { name: 'Année' }).fill('1992');
    await page.getByLabel('Genre').selectOption('male');
    await postalcode(page, env);
    await page.getByRole('button', { name: 'Accéder' }).click();
    const infoDiv = page.locator('#tblList_info');
    const initialText = await infoDiv.innerText(); // e.g., "Affichage de 1 à 2 sur 4 entrées"
    const initialCount = parseInt(initialText.match(/sur (\d+) entrées/)[1], 10); // Extract the number after "sur"
    console.log(`Initial count: ${initialCount}`);
    await page.getByRole('button', {name: 'Annuler ce rendez-vous'}).first().click();
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'Annuler le rendez-vous' }).click();
    await page.waitForTimeout(10000);
    const updatedText = await infoDiv.innerText(); // e.g., "Affichage de 1 à 2 sur 3 entrées"
    const updatedCount = parseInt(updatedText.match(/sur (\d+) entrées/)[1], 10); // Extract the number after "sur"
    console.log(`Updated count: ${updatedCount}`);
    expect(updatedCount).toBe(initialCount - 1);
  });
});