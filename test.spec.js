const { test, expect } = require('@playwright/test');

test('Test truyệnqqgo theo từng bước với step', async ({ page }) => {
  await test.step('Bước 1: Mở trang truyệnqqgo', async () => {
    await page.goto('https://truyenqqgo.com/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/truyện/i);
    console.log('✅ Đã vào trang truyện.');
  });

  await test.step('Bước 2: Chờ truyện đầu tiên và click', async () => {
    await page.waitForSelector('.book_avatar', { timeout: 30000 });
    const stories = await page.$$('.book_avatar');
    expect(stories.length).toBeGreaterThan(0);
    await stories[0].click();
    console.log('✅ Đã click truyện đầu tiên.');
  });

  await test.step('Bước 3: Chờ và click nút Chap đầu', async () => {
    await page.waitForSelector('.fa.fa-book', { timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.click('.fa.fa-book');
    console.log('✅ Đã click nút Chap đầu.');
  });

  await test.step('Bước 4: Cuộn trang với giới hạn số lần cuộn', async () => {
    const scrollStep = 300;
    const scrollDelay = 500;
    let lastScrollY = 0;
    let scrollCount = 0;
    const maxScrollCount = 20;  

    while (scrollCount < maxScrollCount) {
      const newScrollY = await page.evaluate(step => {
        window.scrollBy(0, step);
        return window.scrollY;
      }, scrollStep);

      if (newScrollY === lastScrollY) {
        console.log('Không cuộn thêm được nữa, dừng.');
        break;
      }
      lastScrollY = newScrollY;
      scrollCount++;
      await page.waitForTimeout(scrollDelay);
    }
    console.log('✅ Đã cuộn hết trang.');
    expect(lastScrollY).toBeGreaterThan(0);
  });

  await test.step('Bước 5: Đợi 5 giây để quan sát', async () => {
    await page.waitForTimeout(5000);
  });
}, { timeout: 60000 });
