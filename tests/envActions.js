// helpers/envActions.js

/**
 * Clicks the correct "Next" button in vitrai questions based on environment.
 */
export async function clickNextButton(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('button', { name: 'Suivant' }).click();
  } else if (env.includes('test')) {
    await page.getByRole('button', { name: 'Continuer' }).click();
  } else {
    await page.getByRole('button', { name: 'Suivant' }).click();
  }
}

/**
 * postal code in patient details based on environment.
 */
export async function postalcode(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('textbox', { name: 'Code Postal' }).fill('G0R 0C6');
  } else if (env.includes('test')) {
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('G8Z 1X3');
  } else {
    await page.getByRole('textbox', { name: 'Code Postal' }).fill('G0R 0C6');
  }
}

/**
 * postal code in postal code page based on environment.
 */
export async function postalcodepage(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('textbox', { name: 'ex: H1H1H1' }).fill('G0R0C6');
  } else if (env.includes('test')) {
    await page.getByRole('textbox', { name: 'ex: HTH1H1' }).fill('G0R0C6');
  } else {
    await page.getByRole('textbox', { name: 'ex: H1H1H1' }).fill('G0R0C6');
  }
}

/**
 * se connector in sag based on environment.
 */
export async function SAG(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('listitem').click();
  } else if (env.includes('test')) {
    await page.getByRole('link', { name: 'Se connecter' }).click();
  } else {
    await page.getByRole('listitem').click();
  }
}
