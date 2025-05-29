const fs = require('fs');
const path = require('path');
const playwright = require('playwright-extra');

(async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--proxy-bypass-list=*', '--no-sandbox']
  });

 //quayviudeo
  const context = await browser.newContext({
    recordVideo: {
      dir: './videos',            
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    await page.goto('https://truyenqqgo.com/', { waitUntil: 'domcontentloaded' });
    console.log('✅ Đã vào trang truyện.');

    await page.waitForSelector('.book_avatar', { timeout: 30000 });
    const stories = await page.$$('.book_avatar');
    if (stories.length === 0) throw new Error('❌ Không tìm thấy truyện.');
    await stories[0].click();
    console.log('✅ Đã click truyện đầu tiên.');

    await page.waitForSelector('.fa.fa-book', { timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.click('.fa.fa-book');
    console.log('✅ Đã click nút Chap đầu.');

    const scrollStep = 600;
    const scrollDelay = 200;
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
      await page.waitForTimeout(5000);

  } catch (error) {
    console.error(error.message);
  } finally {
    
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
     const newVideoPath = path.join('./videos', `video_${Date.now()}.webm`);
     fs.renameSync(videoPath, newVideoPath);
    console.log('Video được lưu ở:', newVideoPath);
  }
})();
