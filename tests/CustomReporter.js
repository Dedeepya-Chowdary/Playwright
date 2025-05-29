// tests/CustomReporter.js
const fs = require('fs');
const path = require('path');

class CustomReporter {
  constructor(options) {
    this.outputFile = options.outputFile || 'playwright-report.html';
    this.results = {};
    this.startTime = null;
    this.endTime = null;
  }

  onBegin() {
    this.startTime = new Date();
    this.results = {};
  }

  onTestEnd(test, result) {
    const env = test.parent.project().metadata.env || 'unknown';
    if (!this.results[env]) {
      this.results[env] = [];
    }
    this.results[env].push({
      title: test.title,
      status: result.status,
      duration: result.duration,
    });
  }

  onEnd() {
    this.endTime = new Date();
    this.generateReport();
  }

  generateReport() {
    // Calculate summary and total duration for each environment
    const summary = {};
    const totalDuration = {};
    let totalPassed = 0;
    let totalFailed = 0;

    for (const env in this.results) {
      const tests = this.results[env];
      const passed = tests.filter(test => test.status === 'passed').length;
      const failed = tests.filter(test => test.status === 'failed').length;
      const skipped = tests.filter(test => test.status === 'skipped').length;
      const duration = tests.reduce((sum, test) => sum + test.duration, 0);

      summary[env] = { passed, failed, skipped };
      totalDuration[env] = duration;
      totalPassed += passed;
      totalFailed += failed;
    }

    // Language translations
    const translations = {
      en: {
        lang: 'en',
        title: 'TEST RESULTS',
        started: 'Started',
        ended: 'Ended',
        testsPassed: 'Tests Passed',
        testsFailed: 'Tests Failed',
        testDetails: 'Test Details',
        testName: 'Test Name',
        duration: 'DURATION FOR',
        systemEnv: 'System Details',
        name: 'Name',
        value: 'Value',
        os: 'OS',
        passed: 'passed',
        failed: 'failed',
        skipped: 'skipped',
        testduration: "TEST Duration (ms)",
        uatduration: "UAT Duration (ms)",
        toggleLang: 'Switch to French'
      },
      fr: {
        lang: 'fr',
        title: 'RÉSULTATS DES TESTS',
        started: 'Début',
        ended: 'Fin',
        testsPassed: 'Tests Réussis',
        testsFailed: 'Tests Échoués',
        testDetails: 'Détails des Tests',
        testName: 'Nom du Test',
        duration: 'DURÉE POUR',
        systemEnv: 'Détails Système',
        name: 'Nom',
        value: 'Valeur',
        os: 'OS',
        passed: 'réussi',
        failed: 'échoué',
        skipped: 'ignoré',
        testduration: "TEST DURÉE (ms)",
        uatduration: "UAT DURÉE (ms)",
        toggleLang: 'Passer à l\'Anglais'
      }
    };

    const testNames = {
      "en":{
        "Appointment for orphan":"Appointment for orphan",
        "Appointment with family doctor" : "Appointment with family doctor",
        "Appointment with clinic":"Appointment with clinic",
        "Cancel Appointment":"Cancel Appointment",
        "Selfcare for Telephone Page" :"Self Care for Telephone page",
        "Authentication with SAG" : "Authentication with SAG",
        "Selfcare for virtual" : "Self Care for Virtual",
        "Renew Appointment" : "Renew Appointment"

      },
      "fr":{
        "Appointment for orphan":"Rendez-vous pour un orphelin",
        "Appointment with family doctor" : "Rendez-vous pour patient avec médecin de famille",
        "Appointment with clinic":"Rendez-vous pour patient inscrit de groupe",
        "Cancel Appointment":"Annuler un rendez-vous",
        "Selfcare for Telephone Page" :"Autosoins - Page Téléphonique",
        "Selfcare for virtual" : "Autosoins - Page Virtuelle",
        "Renew Appointment" : "Renouveler le Rendez-vous",
        "Authentication with SAG":"Authentification avec SAG"
      }
    }

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Playwright Test Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 40px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background-color: #e9ecef;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
          }
          .title {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 30px;
            color: #333;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            margin-bottom: 30px;
            gap: 20px;
          }
          .summary > div {
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            width: 250px;
            box-shadow: 0 0 6px rgba(0,0,0,0.05);
            text-align: center;
          }
          .pie-chart {
            width: 150px;
            height: 150px;
            margin: 0 auto;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 6px rgba(0,0,0,0.05);
          }
          .table th, .table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .table th {
            background-color: #f1f1f1;
            font-weight: bold;
            color: #333;
          }
          .passed { color: #28a745; font-weight: bold; }
          .failed { color: #dc3545; font-weight: bold; }
          .skipped { color: #ffc107; font-weight: bold; }
          .duration {
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
            color: #555;
          }
          .system-info {
            width: 50%;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #ddd;
            box-shadow: 0 0 6px rgba(0,0,0,0.05);
          }
          h3 {
            color: #444;
            margin-top: 40px;
          }
          .lang-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
          }
          .lang-toggle:hover {
            background-color: #0056b3;
          }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <button class="lang-toggle" onclick="toggleLanguage()"></button>

        <div class="header">
          <div><span class="trans" data-key="started"></span>: ${this.startTime.toLocaleString("en-CA", { timeZone: "America/Toronto" })}</div>
          <div><span class="trans" data-key="ended"></span>: ${this.endTime.toLocaleString("en-CA", { timeZone: "America/Toronto" })}</div>
          <div><span class="trans" data-key="testsPassed"></span>: ${totalPassed}</div>
          <div><span class="trans" data-key="testsFailed"></span>: ${totalFailed}</div>
        </div>

        <div class="title"><span class="trans" data-key="title"></span></div>

        <div class="summary">
          ${Object.keys(summary).map(env => `
            <div>
              <h3>${env.toUpperCase()}</h3>
              <canvas class="pie-chart" id="chart-${env}"></canvas>
              <p><span class="trans" data-key="passed"></span>: ${summary[env].passed}, <span class="trans" data-key="failed"></span>: ${summary[env].failed}, <span class="trans" data-key="skipped"></span>: ${summary[env].skipped}, 0 autres</p>
              <div class="duration"><span class="trans" data-key="duration"></span> ${env.toUpperCase()}: ${totalDuration[env]} ms</div>
              <script>
                new Chart(document.getElementById('chart-${env}'), {
                  type: 'pie',
                  data: {
                    labels: ['${translations.en.passed}', '${translations.en.failed}', '${translations.en.skipped}'],
                    datasets: [{
                      data: [${summary[env].passed}, ${summary[env].failed}, ${summary[env].skipped}],
                      backgroundColor: ['#28a745', '#dc3545', '#ffc107']
                    }]
                  },
                  options: { responsive: false }
                });
              </script>
            </div>
          `).join('')}
        </div>

        <h3><span class="trans" data-key="testDetails"></span></h3>
        <table class="table">
          <thead>
            <tr>
  <th><span class="trans" data-key="testName"></span></th>
  ${Object.keys(summary).map(env => `<th>${env.toUpperCase()}</th>`).join('')}
  ${Object.keys(summary).map(env => `
    <th>
      <span class="trans duration-label" data-key="${env.toLowerCase()}duration" data-env="${env}">${env.toUpperCase()} Duration (ms)</span>
    </th>`).join('')}
</tr>

          </thead>
          <tbody>
            ${this.generateTestRows()}
          </tbody>
        </table>

        <h3><span class="trans" data-key="systemEnv"></span></h3>
        <table class="table system-info">
          <tr><th><span class="trans" data-key="name"></span></th><th><span class="trans" data-key="value"></span></th></tr>
          <tr><td><span class="trans" data-key="os"></span></td><td>${process.platform === 'win32' ? 'Windows' : process.platform}</td></tr>
        </table>

        <script>
          const translations = ${JSON.stringify(translations)};
          const testNames = ${JSON.stringify(testNames)};
          let currentLang = 'en';

          function toggleLanguage() {
            currentLang = currentLang === 'en' ? 'fr' : 'en';
            updateContent();
            updateTitle();
          }

          function updateTitle(){
            document.querySelectorAll('.testTrans').forEach(ele=>{
               const key = ele.getAttribute('test-title');
               ele.textContent = testNames[currentLang][key] || key;
            })
          }
          
          function updateContent() {
            document.querySelectorAll('.trans').forEach(element => {
              const key = element.getAttribute('data-key');
              element.textContent = translations[currentLang][key];
            });

            document.querySelectorAll('.duration-label').forEach(element => {
            const key = element.getAttribute('data-key');
            const env = element.getAttribute('data-env').toUpperCase();
            element.textContent = env;
            })
            document.querySelector('.lang-toggle').textContent = translations[currentLang].toggleLang;
            document.documentElement.lang = translations[currentLang].lang;
            
            // Update chart labels
            ${Object.keys(summary).map(env => `
              const chart${env} = document.getElementById('chart-${env}').getContext('2d');
              Chart.getChart('chart-${env}').data.labels = [
                translations[currentLang].passed,
                translations[currentLang].failed,
                translations[currentLang].skipped
              ];
              Chart.getChart('chart-${env}').update();
            `).join('')}
          }

          // Initial content update
          updateContent();
          updateTitle();
        </script>
      </body>
      </html>
    `;

    // Write the report to the output file
    fs.writeFileSync(this.outputFile, htmlContent);
  }

  generateTestRows() {
    const allTests = new Set();
    for (const env in this.results) {
      this.results[env].forEach(test => allTests.add(test.title));
    }

    return Array.from(allTests).map(title => {
      const statuses = [];
      const durations = [];

      Object.keys(this.results).forEach(env => {
        const test = this.results[env].find(t => t.title === title);
        if (test) {
          statuses.push(`<td class="${test.status}"><span class="trans" data-key="${test.status}"></span></td>`);
          durations.push(`<td>${test.duration}</td>`);
        } else {
          statuses.push(`<td>-</td>`);
          durations.push(`<td>-</td>`);
        }
      });

      return `
        <tr>
          <td><span class="testTrans" test-title="${title}">${title}</span></td>
          ${statuses.join('')}
          ${durations.join('')}
        </tr>
      `;
    }).join('');
  }
}

module.exports = CustomReporter;