import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(__dirname, 'test-screenshots');

import fs from 'fs';
if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 크기

console.log('1) 로그인 페이지 접속...');
await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${SHOTS}/01-login.png` });

console.log('2) 로그인 중 (test / test)...');
await page.fill('input[type="text"], input[name="username"], input:not([type="password"])', 'test');
await page.fill('input[type="password"]', 'test');
await page.screenshot({ path: `${SHOTS}/02-filled.png` });
await page.click('button[type="submit"], button:has-text("로그인")');

console.log('3) 홈 페이지 대기...');
await page.waitForURL('http://localhost:5173/', { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(1500);
await page.screenshot({ path: `${SHOTS}/03-home.png` });

console.log('4) 알림 아이콘 확인 및 클릭...');
// NotificationsIcon 버튼 찾기
const notifBtn = page.locator('button:has(svg[data-testid="NotificationsIcon"])');
const count = await notifBtn.count();
console.log(`  알림 버튼 발견: ${count}개`);

if (count > 0) {
  await notifBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${SHOTS}/04-drawer-open.png` });
  console.log('  ✅ 알림 드로어 열림');

  // 드로어 내용 확인
  const drawerText = await page.locator('.MuiDrawer-root').textContent().catch(() => '');
  console.log(`  드로어 내용: "${drawerText.trim().slice(0, 80)}"`);

  // 닫기 버튼 클릭
  const closeBtn = page.locator('.MuiDrawer-root button:has(svg[data-testid="CloseIcon"])');
  await closeBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOTS}/05-drawer-closed.png` });
  console.log('  ✅ 알림 드로어 닫힘');
} else {
  console.log('  ⚠️  알림 버튼을 못 찾음 - 전체 버튼 목록:');
  const btns = await page.locator('button').all();
  for (const b of btns) {
    const txt = await b.textContent();
    console.log('   -', txt.trim().slice(0, 40));
  }
}

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
if (errors.length) console.log('콘솔 에러:', errors);
else console.log('콘솔 에러 없음 ✅');

await browser.close();
console.log(`\n스크린샷 저장 위치: ${SHOTS}`);
