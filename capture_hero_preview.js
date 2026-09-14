const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactsDir = 'C:\\Users\\SHREYA\\.gemini\\antigravity-ide\\brain\\f4b8d8d4-f4a0-4196-8b1b-5dc6a5f8d1d3';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const viewports = [
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'desktop_1920x1080', width: 1920, height: 1080 },
  { name: 'laptop_1280x720', width: 1280, height: 720 },
  { name: 'mobile_390x844', width: 390, height: 844 }
];

async function capture(tag = 'preview') {
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
    await page.screenshot({
      path: path.join(artifactsDir, `${tag}_${vp.name}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: vp.height }
    });
    console.log(`Captured ${tag}_${vp.name}.png`);
  }

  await browser.close();
  console.log('Capture complete.');
}

const tag = process.argv[2] || 'preview';
capture(tag).catch(console.error);
