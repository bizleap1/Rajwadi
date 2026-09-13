const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactsDir = 'C:\\Users\\SHREYA\\.gemini\\antigravity-ide\\brain\\8017c423-2578-4418-af5e-7dab79203fdd';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching browser with Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500)); // Allow framer-motion animations and image to load

  // 1. Hero & Navbar Screenshot (Desktop 1440x900)
  console.log('Capturing Hero & Navbar (Desktop)...');
  await page.screenshot({
    path: path.join(artifactsDir, '01_hero_navbar.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });

  // 1a. Hover State on Navbar Link over Hero
  console.log('Capturing Navbar Link Hover State (over Hero)...');
  await page.hover('header nav a:nth-child(2)'); // Hover "Bridal"
  await new Promise(r => setTimeout(r, 400)); // Allow 300ms transition to complete
  await page.screenshot({
    path: path.join(artifactsDir, '01_navbar_hover.png'),
    clip: { x: 0, y: 0, width: 1440, height: 120 }
  });

  // 1b. Scrolled Navbar State (Ivory background with Charcoal text)
  console.log('Capturing Scrolled Navbar State...');
  await page.evaluate(() => window.scrollBy(0, 300));
  await new Promise(r => setTimeout(r, 600));
  const header = await page.$('header');
  if (header) {
    await header.screenshot({
      path: path.join(artifactsDir, '01_navbar_scrolled.png')
    });
  }

  // 1c. Scrolled Navbar Link Hover State
  console.log('Capturing Scrolled Navbar Hover State...');
  await page.hover('header nav a:nth-child(1)'); // Hover "Collections"
  await new Promise(r => setTimeout(r, 400));
  if (header) {
    await header.screenshot({
      path: path.join(artifactsDir, '01_navbar_scrolled_hover.png')
    });
  }

  // 1d. Mobile Hero Screenshot (390x844)
  console.log('Capturing Hero & Navbar (Mobile)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(artifactsDir, '01_mobile_hero.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 }
  });

  // Restore Desktop Viewport for remaining sections
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 800));

  // 2. Collections Section
  console.log('Capturing Collections Section...');
  const collectionsElement = await page.$('#collections');
  if (collectionsElement) {
    await page.evaluate(() => document.querySelector('#collections').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1500));
    await collectionsElement.screenshot({
      path: path.join(artifactsDir, '02_collections.png')
    });
  }

  // 3. Featured Poshaks Section
  console.log('Capturing Featured Poshaks...');
  const featuredElement = await page.$('#featured');
  if (featuredElement) {
    await page.evaluate(() => document.querySelector('#featured').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1500));
    await featuredElement.screenshot({
      path: path.join(artifactsDir, '03_featured_poshaks.png')
    });
  }

  // 4. Brand Story Section
  console.log('Capturing Brand Story...');
  const storyElement = await page.$('#story');
  if (storyElement) {
    await page.evaluate(() => document.querySelector('#story').scrollIntoView({ behavior: 'instant', block: 'start' }));
    await new Promise(r => setTimeout(r, 1500));
    await storyElement.screenshot({
      path: path.join(artifactsDir, '04_brand_story.png')
    });
  }

  console.log('All screenshots captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error taking screenshots:', err);
  process.exit(1);
});
