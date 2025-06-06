// helpers/envActions.js

/**
 * Clicks the correct "Next" button in vitrai questions based on environment.
 */
export async function clickNextButton(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('button', { name: 'Suivant' }).click();
  } else if (env.includes('test')) {
    await page.getByRole('button', { name: 'Suivant' }).click();
  } else {
    await page.getByRole('button', { name: 'Suivant' }).click();
  }
}

/**
 * postal code in patient details based on environment.
 */
export async function postalcode(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('textbox', { name: 'Code Postal' }).fill('G8Z1X3');
  } else if (env.includes('test')) {
    await page.getByRole('textbox', { name: 'Code Postal' }).fill('G8Z1X3');
  } else {
    await page.getByRole('textbox', { name: 'Code Postal' }).fill('G8Z1X3');
  }
}

/**
 * postal code in postal code page based on environment.
 */
export async function postalcodepage(page, env) {
  if (env.includes('uat')) {
    await page.getByRole('textbox', { name: 'ex: H1H1H1' }).fill('G8Z1X3');
  } else if (env.includes('test')) {
    await page.getByRole('textbox', { name: 'ex: H1H1H1' }).fill('G8Z1X3');
  } else {
    await page.getByRole('textbox', { name: 'ex: H1H1H1' }).fill('G8Z1X3');
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

/**
 * number sequential in patients details page based on evironment.
 */
export async function numbersequential(page, env) {
  if (env.includes('test')) {
    await page.getByRole('textbox', { name: 'Numéro séquentiel' }).fill('1');
  } else {
    await page.getByRole('textbox', { name: 'Numéro séquentiel' }).fill('1');
  }
}

/**
 * acceder button in patients details page based on evironment.
 */
export async function accederbutton(page, env) {
  if (env.includes('test')) {
    await page.getByRole('button', { name: 'Suivant' }).click();
  } else {
    await page.getByRole('button', { name: 'Suivant' }).click();
  }
}
