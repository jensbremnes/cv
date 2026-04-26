const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.emulateMedia({ media: 'print' });
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  const outputPath = path.resolve(__dirname, 'JensEinarBremnes_CV.pdf');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log(`PDF generated: ${outputPath}`);
})();
