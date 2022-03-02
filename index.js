const credentials = require('./credentials.json').credentials;
const puppeteer = require('puppeteer');
const {
  loginToTwitter,
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


console.clear();
const login = async () => {
  browser = await puppeteer.launch({
    slowMo: 30,
    headless: true
  });
  page = await browser.newPage();
  console.log('Logging in to twitter...');
  await loginToTwitter(page, credentials.email, credentials.password, credentials.username);
};
const followRun = async (hashtag) => {
  let toFollow = [];
  let tweets = await searchHashtag(hashtag, credentials.bearer);
  tweets.data.forEach(tweet => {
    toFollow.push(tweets.includes.users.filter(user => tweet.author_id == user.id )[0].username);
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
  const hashtag = process.argv.slice(2)[0];
  await login();
  await followRun(hashtag);
  setInterval(() => {
    followRun(hashtag);
  }, 1000 * 60 * 7);
}
main();