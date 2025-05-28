  const playwright = require('playwright-extra');




  (async () => {
    const browser = await playwright.chromium.launch({
      headless: false, // ⚠️ bật giao diện để tránh bị chặn bot
      args: ['--proxy-bypass-list=*', '--no-sandbox']
    });

    const page = await browser.newPage();

    // 👉 Mở trang
    await page.goto('https://truyenqqgo.com/', { waitUntil: 'domcontentloaded' });
    console.log('✅ Đã vào trang truyện.');

    // 👉 Chờ truyện đầu tiên và click
    await page.waitForSelector('.book_avatar', { timeout: 30000 });
    const stories = await page.$$('.book_avatar');
    if (stories.length === 0) {
      console.log('❌ Không tìm thấy truyện.');
      await browser.close();
      return;
    }

    await stories[0].click();
    console.log('✅ Đã click truyện đầu tiên.');

    // Chờ và click nút Chap đầu
    await page.waitForSelector('.fa.fa-book', { timeout: 30000 });
    await page.waitForTimeout(3000); // Đợi thêm 3 giây
    await page.click('.fa.fa-book');
    console.log('✅ Đã click nút Chap đầu.');

    // Kéo xuống để xem truyện
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

    // 👉 Đợi 30 giây rồi thoát
    await page.waitForTimeout(30000);
    await browser.close();
  })();
