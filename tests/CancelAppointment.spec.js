const { test, expect } = require('@playwright/test');
const { setupSteps } = require('./Setup'); // import navigation steps
const { WaitPage } = require('./Waitpage');
const {cancelappointment}= require('./envActions'); 

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
    await page.locator('#txtSeq').fill('1');
    await page.getByRole('spinbutton', { name: 'Jour' }).fill('1');
    await page.getByRole('spinbutton', { name: 'Année' }).fill('1992');
    await page.getByLabel('Genre').selectOption('male');
    await page.getByRole('textbox', { name: 'Code Postal' }).fill('G8Z1X3');
    await page.getByRole('button', { name: 'Suivant' }).click();
    var initialCount,updatedCount,infoDiv,totalEntriesSpan;
    /*if (env.includes('test')){
      infoDiv = page.locator('#tblList_info');
      const initialText = await infoDiv.innerText(); // e.g., "Affichage de 1 à 2 sur 4 entrées"
      initialCount = parseInt(initialText.match(/sur (\d+) entrées/)[1], 10); // Extract the number after "sur"
    } else {*/
      // Locate the span element with class "total-entries"
      totalEntriesSpan = page.locator('span.total-entries');
      // Get the initial text (e.g., "42 éléments") and extract the number
      const initialText = await totalEntriesSpan.innerText();
      initialCount = parseInt(initialText.split(' ')[0], 10); // Extracts "42" and converts to integer
    //}
    if(initialCount==0){
      const noappointment=page.locator('#noAppointmentsMsg')
      await expect(noappointment).toHaveText('        Vous n\'avez aucun rendez-vous pour le moment.');
    } else {
      await page.getByRole('button', { name: 'Annuler ce rendez-vous' }).first().click();
      await page.waitForTimeout(10000);
      await page.getByRole('button', { name: 'Annuler le rendez-vous' }).click();
      await page.waitForTimeout(10000);
      await page.getByRole('button', { name: 'Fermer' }).click();
      await page.waitForTimeout(5000);
      /*if (env.includes('test')){
        const updatedText = await infoDiv.innerText(); // e.g., "Affichage de 1 à 2 sur 3 entrées"
        updatedCount = parseInt(updatedText.match(/sur (\d+) entrées/)[1], 10); // Extract the number after "sur"
      } else {*/
        // Get the updated text after cancellation (e.g., "41 éléments")
        const updatedText = await totalEntriesSpan.innerText();
        updatedCount = parseInt(updatedText.split(' ')[0], 10); // Extracts "41" and converts to integer
      //}
      expect(updatedCount).toBe(initialCount - 1);
    }
  });
});