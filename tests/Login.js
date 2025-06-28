const { chromium } = require('playwright');
const fs = require('fs');

const ENV_MAP = {
  dev: 'https://votre-sante-dev.powerappsportals.com',
  test: 'https://votre-sante-test.powerappsportals.com',
  uat: 'https://votre-sante-uat.powerappsportals.com',
  int: 'https://votre-sante-int.powerappsportals.com'
};

// MFA-related cookies to retain
const MFA_COOKIES = [
  'ESTSAUTH',
  'ESTSAUTHPERSISTENT',
  'ESTSAUTHLIGHT',
  'SignInStateCookie',
  'CCState',
  'buid',
  'fpc'
];

// Cookies to exclude (cache-related and non-essential)
const EXCLUDE_COOKIES = [
  'WebPageCaching',
  'ARRAffinity',
  'ARRAffinitySameSite',
  'Dynamics365PortalAnalytics',
  'x-ms-gateway-slice',
  'stsservicecookie',
  'AADSSO',
  'SSOCOOKIEPULLED',
  'MicrosoftApplicationsTelemetryDeviceId',
  'brcap',
  'wlidperf',
  'uaid',
  'MSPRequ',
  'MC1',
  'MS0',
  'MSFPC',
  'ai_session',
  '.AspNet.ExternalCookie',
  '.AspNet.ExternalCookieC1',
  '.AspNet.ExternalCookieC2',
  'PrivateModeLoginCookie'
];

async function filterMFACookies(cookies) {
  return cookies.filter(cookie => 
    MFA_COOKIES.includes(cookie.name) || 
    cookie.name.startsWith('esctx') // Include all esctx-* cookies
  );
}

async function setupSteps(page) {
  await page.goto('/fr-FR/');

  await page.waitForTimeout(10000);

  await page.getByRole('textbox', { name: 'Enter your email, phone, or' })
    .fill('Sajja.Dedeepya.ext@sante.quebec');

  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByRole('textbox', { name: 'Password' })
    .fill('Premsai@143');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForTimeout(10000); // Wait for MFA prompt

  await page.getByRole('button', { name: 'Yes' }).click();
}

(async () => {
  const env = process.argv[2]; // e.g., dev, test, uat, int
  if (!env || !ENV_MAP[env]) {
    console.error('❌ Please pass environment: dev, test, uat, or int');
    process.exit(1);
  }

  const baseURL = ENV_MAP[env];
  const storagePath = `auth/storageState.${env}.json`;

  const browser = await chromium.launch({ headless: false }); // Headed for MFA
  const context = await browser.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    } // Disable browser caching
  });
  const page = await context.newPage();

  try {
    await setupSteps(page);

    await page.waitForTimeout(5000); // Ensure MFA completes

    // Get full storage state
    const storageState = await context.storageState();

    // Filter cookies to keep only MFA-related ones
    const filteredCookies = await filterMFACookies(storageState.cookies);

    // Create new storage state with filtered cookies
    const filteredStorageState = {
      ...storageState,
      cookies: filteredCookies
    };

    // Save filtered storage state
    fs.writeFileSync(storagePath, JSON.stringify(filteredStorageState, null, 2));

    console.log(`✅ Login session for '${env}' saved at ${storagePath} with MFA cookies only`);
  } catch (error) {
    console.error(`❌ Error during setup for '${env}':`, error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();