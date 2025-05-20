 const { test, expect } = require('@playwright/test');
 const { setupSteps} = require('./Setup');
 const { WaitPage } = require('./Waitpage'); 
 const { SAG } = require('./envActions');

 
 test.describe('SAG Tests', () => { 
    
    test.beforeEach(async ({ page }) => {
        await setupSteps(page);
    });
    
    test('Authentication with SAG', async ({ page }, testInfo) => {
    const env = testInfo.project.metadata.env;

        await page.getByRole('link', { name: 'Se connecter' }).click();
        await page.getByRole('button', { name: 'J\'accepte' }).click();
        await page.getByRole('link', { name: 'Quitter' }).click();
        await page.getByText('Votre Santé français English').click();
        await page.getByRole('link', { name: 'Se connecter' }).click();
        await page.getByRole('button', { name: 'J\'accepte' }).click();
        await page.getByRole('link', { name: 'Créer un compte' }).click();
        await page.getByRole('button', { name: 'Précédent' }).click();
        await page.getByRole('link', { name: 'Créer un compte' }).click();
        await page.getByRole('textbox', { name: 'Nom d\'utilisateur' }).fill('sajja1');
        await page.getByRole('textbox', { name: 'Adresse courriel' }).fill('sajjadedeepya01@gmail.com');
        await page.getByRole('textbox', { name: 'Mot de passe', exact: true }).fill('KrishnaDedu@143');
        await page.getByRole('textbox', { name: 'Confirmez le mot de passe' }).fill('KrishnaDedu@143');
        await page.locator('#checkMark').click();
        await page.getByRole('button', { name: 'Suivant' }).click();
        await page.getByRole('button', { name: 'Quitter' }).click();
        await page.getByRole('button', { name: 'Rester sur la page' }).click();
        await page.getByRole('button', { name: 'Quitter' }).click();
        await page.getByRole('button', { name: 'Quitter le service' }).click();
        await expect(page).toHaveTitle('Accueil');
        await SAG(page, env);
        await page.getByRole('button', { name: 'J\'accepte' }).click();
        await page.getByRole('textbox', { name: 'Adresse courriel ou nom d\'' }).fill('dedeepyasajja201@gmail.com');
        await page.getByRole('textbox', { name: 'Mot de passe' }).fill('KrishnaDedu@143');
        await page.locator('#checkMark').click();
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await page.getByRole('button', { name: 'Commencer le processus d\'identification' }).click();
        await page.waitForTimeout(10000);
    });
});