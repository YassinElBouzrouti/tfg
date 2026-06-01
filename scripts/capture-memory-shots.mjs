import { chromium, devices } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'http://localhost:5173';
const outDir = path.resolve('capturas_memoria');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function waitForStable(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1200);
}

async function capturePublicScreens(browser) {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktop.newPage();
  await desktopPage.goto(`${baseUrl}/`);
  await waitForStable(desktopPage);
  await desktopPage.screenshot({ path: path.join(outDir, '01_home_pc.png'), fullPage: true });

  await desktopPage.goto(`${baseUrl}/register`);
  await waitForStable(desktopPage);
  await desktopPage.screenshot({ path: path.join(outDir, '02_register_pc.png'), fullPage: true });

  await desktopPage.goto(`${baseUrl}/login`);
  await waitForStable(desktopPage);
  await desktopPage.screenshot({ path: path.join(outDir, '03_login_pc.png'), fullPage: true });

  await desktopPage.goto(`${baseUrl}/admin`);
  await waitForStable(desktopPage);
  await desktopPage.screenshot({ path: path.join(outDir, '04_admin_access_pc.png'), fullPage: true });
  await desktop.close();

  const tablet = await browser.newContext({
    ...devices['iPad Pro 11'],
    viewport: { width: 834, height: 1112 },
  });
  const tabletPage = await tablet.newPage();
  await tabletPage.goto(`${baseUrl}/`);
  await waitForStable(tabletPage);
  await tabletPage.screenshot({ path: path.join(outDir, '05_home_tablet.png'), fullPage: true });
  await tablet.close();

  const mobile = await browser.newContext({ ...devices['iPhone 13'] });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseUrl}/`);
  await waitForStable(mobilePage);
  await mobilePage.screenshot({ path: path.join(outDir, '06_home_mobile.png'), fullPage: true });
  await mobile.close();
}

async function captureMemberArea(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/login`);
  await waitForStable(page);
  await page.fill('input[type="email"]', 'carlos.mendez@example.com');
  await page.fill('input[type="password"]', 'DojoDemo2026!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/member', { timeout: 15000 });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(outDir, '07_member_dashboard_full.png'), fullPage: true });

  const cards = page.locator('section, article');
  const count = await cards.count();
  for (let i = 0; i < Math.min(count, 6); i += 1) {
    const card = cards.nth(i);
    const box = await card.boundingBox();
    if (box && box.width > 400 && box.height > 120) {
      await card.screenshot({ path: path.join(outDir, `07_member_section_${i + 1}.png`) });
    }
  }

  await context.close();
}

async function captureAdminArea(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${baseUrl}/admin`);
  await waitForStable(page);
  await page.fill('input[type="email"]', 'admin@yassinsgym.com');
  await page.fill('input[type="password"]', 'Admin1234');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(outDir, '08_admin_dashboard_full.png'), fullPage: true });

  const viewProfileLink = page.getByRole('link', { name: 'Ver perfil' }).first();
  if (await viewProfileLink.count()) {
    await viewProfileLink.click();
    await page.waitForURL('**/admin/members/**', { timeout: 15000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, '09_admin_member_profile.png'), fullPage: true });
  }

  await context.close();
}

async function main() {
  await ensureDir(outDir);
  const browser = await chromium.launch({ headless: true });
  try {
    await capturePublicScreens(browser);
    await captureMemberArea(browser);
    await captureAdminArea(browser);
  } finally {
    await browser.close();
  }
  console.log(`Capturas guardadas en: ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

