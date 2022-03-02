const waitForPageChange = async (page) => {
    await page.waitForNavigation({ timeout: 120000 });
  }
  
  const click = async (page, selector) => {
    await page.waitForSelector(selector);
    await page.click(selector);
  };
  
  const open = async (page, url) => {
    await page.goto(url);
  };
  
  const generateRandomTweet = () => {
    return faker.lorem.paragraph().substring(0, 280);
  };
  
  const typeText = async (page, selector, text) => {
    await page.waitForSelector(selector);
    await page.type(selector, text);
  };
  
  const focus = async (page, selector) => {
    await page.waitForSelector(selector);
    await page.focus(selector);
  };
  
  const loginToTwitter = async (page, email, password, username) => {
    await open(page, 'https://twitter.com/i/flow/login');
    
    console.log(`Typing email...`);
    await typeText(page, 'input[type="text"]', email);
    await page.keyboard.press('Enter');
    
    console.log(`Typing username...`);
    await typeText(page, 'input[type="text"]', username);
    await page.keyboard.press('Enter');
    
    console.log(`Typing password...`);
    await typeText(page, 'input[type="password"]', password);
    await page.keyboard.press('Enter');

    await waitForPageChange(page);
    console.log(`Logged in successfully to: ${email}`);
  };
  
  
  const followUsername = async (page, username) => {
    await open(page, 'https://twitter.com/' + username);
    await click(page, '[aria-label="Follow @' + username + '"]');
  };
  
  
  const tweetAfterLogin = async (page, tweet) => {
    await open(page, 'https://twitter.com/compose/tweet');
    await focus(page, '.public-DraftEditor-content');
    await page.keyboard.type(tweet);
    await click(page, 'div[data-testid=tweetButton]');
    await waitForPageChange(page);
    console.log(`Tweeted successfully`);
  };
  
  module.exports = {
    loginToTwitter,
    tweetAfterLogin,
    generateRandomTweet,
    followUsername,
    open
  };