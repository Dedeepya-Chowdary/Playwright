const { expect } = require('@playwright/test');

class WaitPage {
  constructor(page) {
    this.page = page;
  }

  async click(selector, options = {}) {
    await this.page.click(selector, options);
    await this.page.waitForLoadState('load'); // Wait for page load
    // Alternatively, use waitForTimeout for a fixed delay
    // await this.page.waitForTimeout(2000); // 2 seconds
    // Or wait for a specific element
    // await this.page.waitForSelector('text=Next Page Indicator', { state: 'visible', timeout: 10000 });
  }

  async fill(selector, value, options = {}) {
    await this.page.fill(selector, value, options);
    await this.page.waitForLoadState('load');
  }

  async getByRole(role, options = {}) {
    return this.page.getByRole(role, options);
  }

  async getByText(text, options = {}) {
    return this.page.getByText(text, options);
  }

  async locator(selector, options = {}) {
    return this.page.locator(selector, options);
  }
}

module.exports = { WaitPage };