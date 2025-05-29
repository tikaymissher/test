const playwright = require('playwright-extra');

(async () => {
  const browser = await playwright.chromium.launch({
    headless: false, 
    args: ['--proxy-bypass-list=*', '--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Mở trang
    await page.goto('https://truyenqqgo.com/', { waitUntil: 'domcontentloaded' });
    console.log('✅ Đã vào trang truyện.');

    // Chờ truyện đầu tiên và click
    await page.waitForSelector('.book_avatar', { timeout: 30000 });
    const stories = await page.$$('.book_avatar');
    if (stories.length === 0) {
      throw new Error('❌ Không tìm thấy truyện.');
    }
    await stories[0].click();
    console.log('✅ Đã click truyện đầu tiên.');

    // Chờ và click nút Chap đầu
    await page.waitForSelector('.fa.fa-book', { timeout: 30000 });
    await page.waitForTimeout(3000); 
    await page.click('.fa.fa-book');
    console.log('✅ Đã click nút Chap đầu.');

    // Kéo xuống để xem truyện
    const scrollStep = 300;
    const scrollDelay = 800;
    let lastScrollY = 0;
    let scrollCount = 0;
    const maxScrollCount = 50;

    while (scrollCount < maxScrollCount) {
      const newScrollY = await page.evaluate(step => {
        window.scrollBy(0, step);
        return window.scrollY;
      }, scrollStep);

      if (newScrollY === lastScrollY) {
        console.log(' Không cuộn thêm được nữa, dừng.');
        break;
      }
      lastScrollY = newScrollY;
      scrollCount++;
      await page.waitForTimeout(scrollDelay);
    }

    console.log('✅ Đã cuộn hết trang.');

    // Đợi 5 giây rồi thoát 
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error(error.message);
  } finally {
    await browser.close();
  }
})();
