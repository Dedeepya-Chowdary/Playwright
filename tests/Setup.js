// utils/setup.js
const { expect } = require('@playwright/test');
const { WaitPage } = require('./Waitpage');
const { clickNextButton,postalcodepage } = require('./envActions');

async function setupSteps(page) {
  const waitPage = new WaitPage(page);
  await page.goto('/fr-FR/');
  await page.getByRole('textbox', { name: 'Enter your email, phone, or' }).fill('Sajja.Dedeepya.ext@sante.quebec');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Premsai@143');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Yes' }).click();
}

async function NavigationtoQuerypage(page, env) {
  const waitPage = new WaitPage(page);
  await page.locator('.tile').first().click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'J’accepte' }).click();
  await page.getByRole('textbox', { name: 'ex: H1H1H1' }).fill('G8Z1X3');
  await page.getByRole('button', { name: 'Suivant' }).click();
}

async function Navigationtoappointment(page, env) {
  const waitPage = new WaitPage(page);
  await page.locator('#txtSearch').fill('Kidney pain');
  await page.getByRole('button', { name: /continuer|suivant/i }).click();
  await page.getByText('Oui', { exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.locator('#divResp').getByText('Non').click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.locator('#divResp').getByText('Non').click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.locator('#divResp').getByText('Non').click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByText('Oui, mais les douleurs ne').click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByText('Oui', { exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.getByText('Oui', { exact: true }).click();
  await page.getByRole('button', { name: 'Suivant' }).click();
  await page.locator('#choice1').click();
}

module.exports = {
  setupSteps,
  Navigationtoappointment,
  NavigationtoQuerypage
};
