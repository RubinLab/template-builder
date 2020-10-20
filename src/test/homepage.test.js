const { test } = global;
const puppeteer = require('puppeteer');

const goToHomepage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 80,
    // args: ['--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  return page;
};

test('should launch the ', async () => {
  const page = await goToHomepage();
  await page.click('#addQuestionBtn');
  //   await page.type('input#name', 'Anna');
  //   await page.click('input#age');
  //   await page.type('input#age', '28');
  //   await page.click('#btnAddUser');
  //   const finalText = await page.$eval('.user-item', el => el.textContent);
  //   expect(finalText).toBe('Anna (28 years old)');
}, 10000);
