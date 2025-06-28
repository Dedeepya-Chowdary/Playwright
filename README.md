# Introduction 
This project is a Playwright test suite designed to automate smoke testing for a votre sante web application. It includes tests for various functionalities such as authentication, booking appointments, canceling appointments, and self-care.

# Project Structure
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	tests/: Contains all the test specification files written in JavaScript.
2.	AuthenticationwithSAG.spec.js: Tests for authentication with SAG to access vaccination,medicine records pf patient.
3.	BookAppointment.spec.js: Steps required to booking appointments.
4.	CancelAppointment.spec.js: Steps required to canceling appointments.
5.	RenewAppointment.spec.js: Steps required to renewing appointments.
6.	SelfCare.spec.js: Steps required to get self-care telephone,in-person and virtual pages
7.	Setup.js: Setup script contains login steps to access website,navigate to query page and to appointment page
8.	CustomReporter.js: Custom reporter used to generate HTML report in both french and english language.
9.	Waitpage.js: Utility for handling wait pages.
10.	envActions.js: Utility functions for  handling environment-specific actions.
11.	playwright.config.js: Playwright configuration file.
12.	playwright-report.html: HTML report generated after test execution.
13.	CustomReporter.js: Custom reporter for test results.
14.	package.json: Project metadata and dependencies.
15.	package-lock.json: Lock file for dependency versions.
16.	azure-pipelines.yml: Configuration for Azure Pipelines CI/CD.

# Prerequisites
Node.js: Ensure Node.js (v16 or higher) is installed.
Playwright: Install Playwright and its dependencies. 

# Installation
- Clone the repository: git clone (https://forge-msss.visualstudio.com/votre-sante-2/_git/UI%20Automation)
                        cd <repository-name>
- Install dependencies: npm install
- Install Playwright browsers: npx playwright install

# Running Tests
Run all tests: npx playwright test
Run a specific test file: npx playwright test tests/<filename>
Run tests with a specific browser (e.g., Chromium): npx playwright test --project=chromium
Run tests in two evironments (e.g., Chromium): npx playwright test tests --headed --project="test-chromium" --project="UAT-chromium"
Generate a test report: After running tests, an HTML report will be generated in playwright-report.html.

# Viewing Test Reports
- Open the playwright-report.html file in a browser to view the test results.
- Test artifacts (e.g., screenshots, videos) are stored in the test-results/ directory.

# Configuration
The playwright.config.js file contains the test configuration, including:
- Browser settings
- Test timeouts
- Different evironments and their URL's
- Reporter settings

# CI/CD Integration
- The project is set up to run on Azure Pipelines. The configuration is defined in azure-pipelines.yml.