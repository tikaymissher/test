import { test, expect } from '@playwright/test';

async function step1_openPage(page) {
  await page.goto('https://truyenqqgo.com/', { waitUntil: 'domcontentloaded' });
  console.log('✅ Đã vào trang truyện.');
}

async function step2_clickFirstStory(page) {
  await page.waitForSelector('.book_avatar', { timeout: 30000 });
  const stories = await page.$$('.book_avatar');
  if (stories.length === 0) throw new Error('❌ Không tìm thấy truyện.');
  await stories[0].click();
  console.log('✅ Đã click truyện đầu tiên.');
}

async function step3_clickFirstChapter(page) {
  await page.waitForSelector('.fa.fa-book', { timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.click('.fa.fa-book');
  console.log('✅ Đã click nút Chap đầu.');
}

async function step4_scrollPage(page) {
  const scrollStep = 300;
  const scrollDelay = 800;
  let lastScrollY = 0;

  while (true) {
    const newScrollY = await page.evaluate(step => {
      window.scrollBy(0, step);
      return window.scrollY;
    }, scrollStep);

    if (newScrollY === lastScrollY) break;
    lastScrollY = newScrollY;
    await page.waitForTimeout(scrollDelay);
  }
  console.log('✅ Đã cuộn hết trang.');
}

async function step5_waitAndClose(browser, page) {
  await page.waitForTimeout(30000);
  await browser.close();
}

test('Test 5 bước tách biệt chạy nối tiếp', async ({ browserName, browser }) => {
  // Tạo context và page mới
  const context = await browser.newContext();
  const page = await context.newPage();

  await step1_openPage(page);
  await step2_clickFirstStory(page);
  await step3_clickFirstChapter(page);
  await step4_scrollPage(page);
  await step5_waitAndClose(browser, page);
});
