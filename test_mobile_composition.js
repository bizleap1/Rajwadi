const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactsDir = 'C:\\Users\\SHREYA\\.gemini\\antigravity-ide\\brain\\f4b8d8d4-f4a0-4196-8b1b-5dc6a5f8d1d3\\mobile_verification';
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const viewports = [
  { name: 'mobile_320x568', width: 320, height: 568 },
  { name: 'mobile_375x667', width: 375, height: 667 },
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'mobile_414x896', width: 414, height: 896 },
  { name: 'mobile_430x932', width: 430, height: 932 },
  { name: 'tablet_768x1024', width: 768, height: 1024 },
  { name: 'desktop_1440x900', width: 1440, height: 900 }
];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // Capture the Hero and immediate transition
    await page.screenshot({
      path: path.join(artifactsDir, `${vp.name}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: vp.height }
    });
    console.log(`Captured ${vp.name}.png`);

    // Check for any horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    if (scrollWidth > vp.width) {
      console.warn(`WARNING: Horizontal overflow detected on ${vp.name}: scrollWidth=${scrollWidth} vs viewport=${vp.width}`);
    } else {
      console.log(`Overflow check PASSED for ${vp.name}: ${scrollWidth} <= ${vp.width}`);
    }
  }

  await browser.close();
  console.log('Mobile verification capture completed successfully.');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
