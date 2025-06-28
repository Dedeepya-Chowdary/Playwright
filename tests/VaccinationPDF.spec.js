 const { test, expect } = require('@playwright/test');
 const { setupSteps} = require('./Setup');
 const { WaitPage } = require('./Waitpage'); 
 const { SAG } = require('./envActions');

 
 test.describe('SAG Tests', () => { 
    
    test.beforeEach(async ({ page }) => {
        await setupSteps(page);
    });
    
    test('Vaccination with SAG', async ({ page }, testInfo) => {
        var vaccinationpage;
        const env = testInfo.project.metadata.env;
        const page1Promise = page.waitForEvent('popup');
        await page.getByText('Vaccination Consultez ou télé').click();
        const page1 = await page1Promise;
        await page1.getByRole('button', { name: 'J\'accepte' }).click();
        await page1.getByRole('textbox', { name: 'Adresse courriel ou nom d\'' }).fill('Johnny19');
        await page1.getByRole('textbox', { name: 'Mot de passe' }).fill('santequebec');
        await page1.locator('#checkMark').click();
        await page1.getByRole('button', { name: 'Se connecter' }).click();
        /*if(env.includes('uat')){
            await page1.getByRole('button', { name: 'Afficher le consentement' }).click();
            await page1.getByRole('button', { name: 'Je consens' }).click();
            const page2Promise = page1.waitForEvent('popup');
            await page1.getByText('Vaccination Consultez ou télé').click();
            await page.waitForTimeout(20000);
            const vaccinationpage = `https://votre-sante-${env}.powerappsportals.com/fr-FR/Vaccinations/`;//url differ based on evironments
            await expect(page2).toHaveURL(vaccinationpage);
        } else {*/
            await page1.getByRole('button', { name: 'Accéder au service' }).click();
            const page2Promise = page1.waitForEvent('popup');
            await page1.getByText('Vaccination Consultez ou télé').click();
            const page2 = await page2Promise;
            await page.waitForTimeout(60000);
            if (env.includes('test')){
                vaccinationpage = `https://votre-sante-${env}.powerappsportals.com/fr-FR/Vaccinations/`;//url differ based on evironments
            }else{
                vaccinationpage = `https://votre-sante-${env}.powerappsportals.com/fr-FR/carnet-vaccination/`;  
            }

            await expect(page2).toHaveURL(vaccinationpage);
    });
});