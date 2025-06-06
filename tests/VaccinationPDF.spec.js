 const { test, expect } = require('@playwright/test');
 const { setupSteps} = require('./Setup');
 const { WaitPage } = require('./Waitpage'); 
 const { SAG } = require('./envActions');

 
 test.describe('SAG Tests', () => { 
    
    test.beforeEach(async ({ page }) => {
        await setupSteps(page);
    });
    
    test('Vaccination with SAG', async ({ page }, testInfo) => {
        const env = testInfo.project.metadata.env;
        const page1Promise = page.waitForEvent('popup');
        await page.locator('div:nth-child(32) > div:nth-child(2) > div:nth-child(2) > .tile > div').click();
        const page1 = await page1Promise;
        await page1.getByRole('button', { name: 'J\'accepte' }).click();
        await page1.getByRole('textbox', { name: 'Adresse courriel ou nom d\'' }).fill('Johnny4');
        await page1.getByRole('textbox', { name: 'Mot de passe' }).fill('santequebec');
        await page1.locator('#checkMark').click();
        await page1.getByRole('button', { name: 'Se connecter' }).click();
        await page1.getByRole('button', { name: 'Accéder au service' }).click();
        const page2Promise = page1.waitForEvent('popup');
        await page1.locator('div:nth-child(31) > div:nth-child(2) > div:nth-child(2) > .tile > div').click();
        const page2 = await page2Promise;
        await page.waitForTimeout(20000);
        const vaccinationpage = `https://votre-sante-${env}.powerappsportals.com/fr-FR/Vaccinations/`;//url differ based on evironments
        await expect(page2).toHaveURL(vaccinationpage); 
    });
});