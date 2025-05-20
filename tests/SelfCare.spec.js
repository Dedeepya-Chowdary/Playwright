const { test, expect } = require('@playwright/test');
const { setupSteps,NavigationtoQuerypage } = require('./Setup'); // import navigation steps
const { WaitPage } = require('./Waitpage'); 
const { clickNextButton } = require('./envActions');

test.describe('Self Care Tests', () => {

  
    test.beforeEach(async ({ page },testInfo) => {
    const env = testInfo.project.metadata.env;
    await setupSteps(page);
    await NavigationtoQuerypage(page,env);// Call the nvigation steps before each test
  });

 /* test('Selfcare for virtual', async ({ page }) => {
    const waitPage = new WaitPage(page);
    await page.locator('#txtSearch').fill('Injection');
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByText('Vaccin', { exact: true }).click();
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByText('Oui', { exact: true }).click();
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByText('Au cours des 3 prochains jours').click();
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.waitForTimeout(10000);
    await reporter.capture(page, 'Self care for virtual');
    await page.getByRole('button', { name: 'J\'accepte l\'option' }).click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL('https://portal3.clicsante.ca/');
  });*/

  test('Selfcare for Telephone Page', async ({ page },testInfo) => {
    const env = testInfo.project.metadata.env;
    const waitPage = new WaitPage(page);
    await page.locator('#txtSearch').fill('Head Pain');
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.locator('#divResp').getByText('Non').click();
    await clickNextButton(page, env);
    await page.getByText('mois [90 jours] et moins').click();
    await clickNextButton(page, env);
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'J\'accepte l\'option' }).click();
    await page.getByRole('button', { name: 'Accepter' }).click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveTitle('Accueil');
  });

  /*test('Selfcare for Emergency Page', async ({ page }) => {
    const waitPage = new WaitPage(page);
    await page.locator('#txtSearch').fill('I have problems reading. The text is blurry');
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByText('ans et plus').click();
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.getByText('Oui', { exact: true }).click();
    await page.getByRole('button', { name: 'Continuer' }).click();
    await page.waitForTimeout(20000);
    await reporter.capture(page, 'Self care for Emergency Page');
    await page.getByRole('button', { name: 'J\'accepte l\'option' }).click();
    await page.getByRole('button', { name: 'Accepter' }).click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveTitle('Accueil');
  });*/

});