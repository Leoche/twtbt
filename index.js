const credentials = require('./credentials.json').credentials;
const puppeteer = require('puppeteer');
const os = require('os');
const fs = require('fs').promises;
const {
  loginToTwitter,
  open,
  followUsername,
  tweetAfterLogin,
  generateRandomTweet,
} = require('./utils/puppeteer.utils');
const {
  searchHashtag,
} = require('./utils/twitter.utils');
const {
  hasFollowed,
  addFollow
} = require('./utils/db.utils');

let browser = null;
let page = null;
const isHeadless = true;
const userAgent ="Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";


console.clear();
const login = async () => {
  if(os.platform() == "win32") {
    browser = await puppeteer.launch({
      userDataDir: "./user_data/",
      headless: isHeadless
    });
  } else {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      userDataDir: "./user_data/",
      headless: isHeadless
    });
  }
  page = await browser.newPage();
  console.log('Setting userAgent...');
  await page.setUserAgent(userAgent);

  console.log('Check Log to twitter.');
  await open(page, 'https://twitter.com/home');
  await page.waitFor(3000);
  const url = await page.evaluate(() => location.href);
  if(url != 'https://twitter.com/home') {
    console.log('Logging in to twitter...');
    await loginToTwitter(page, credentials.email, credentials.password, credentials.username);
  } else {
    console.log('Already Logged to twitter.');
  }
};
const followRun = async (hashtag) => {
  console.log('[TWTBT] FOLLOW...');
  let toFollow = [];
  let tweets = await searchHashtag(hashtag, credentials.bearer);
  let i = 0;
  let maxCount = 1 + Math.floor(Math.random() * 3);
  tweets.data.forEach(tweet => {
    if(i < maxCount) {
      let username = tweets.includes.users.filter(user => tweet.author_id == user.id )[0].username
      if(!hasFollowed(username)) {
        toFollow.push(username);
        i++;
      }
    }
  });
      
  console.log('Account: ', credentials.email);
  for(username of toFollow) {
    if(!hasFollowed(username)) {
      console.log('Try Following: ', username);
      await followUsername(page, username);
      console.log('Following: ', username);
      addFollow(username);
      console.log('Saved Following: ', username);
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.log('Already followed: ', username);
    }
  }
};
const main = async () => {
  console.clear();
  console.log('[TWTBT] RUNNING...');
  const hashtag = process.argv.slice(2)[0];
  console.log('[TWTBT] LOGGING...');
  await login();
  await followRun(hashtag);
  setInterval(() => {
    followRun(hashtag);
  }, 1000 * 60 * 7);
}
main();