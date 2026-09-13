const puppeteer = require('puppeteer-core');
const path = require('path');

const artifactsDir = 'C:\\Users\\SHREYA\\.gemini\\antigravity-ide\\brain\\8017c423-2578-4418-af5e-7dab79203fdd';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // 5. Craftsmanship Section
  const craftElement = await page.$('#craftsmanship');
  if (craftElement) {
    await page.evaluate(() => document.querySelector('#craftsmanship').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1200));
    await craftElement.screenshot({ path: path.join(artifactsDir, '05_craftsmanship.png') });
  }

  // 6. Lookbook Section
  const lookbookElement = await page.$('#lookbook');
  if (lookbookElement) {
    await page.evaluate(() => document.querySelector('#lookbook').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1200));
    await lookbookElement.screenshot({ path: path.join(artifactsDir, '06_lookbook.png') });
  }

  // 7. Custom Poshak Section
  const customElement = await page.$('#custom');
  if (customElement) {
    await page.evaluate(() => document.querySelector('#custom').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1200));
    await customElement.screenshot({ path: path.join(artifactsDir, '07_custom_poshak.png') });
  }

  // 8. Footer Section
  const footerElement = await page.$('#contact');
  if (footerElement) {
    await page.evaluate(() => document.querySelector('#contact').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1200));
    await footerElement.screenshot({ path: path.join(artifactsDir, '08_footer.png') });
  }

  // 9. Product Modal
  await page.evaluate(() => document.querySelector('#featured').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await new Promise(r => setTimeout(r, 800));
  const viewDetailsButtons = await page.$$('button');
  for (const btn of viewDetailsButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('View Details')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(artifactsDir, '09_product_modal.png') });
      break;
    }
  }

  console.log('Additional screenshots captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
