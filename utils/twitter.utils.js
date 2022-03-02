const needle = require('needle');
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function searchHashtag(hash, token) {

    // Edit query parameters below
    // specify a search query, and any additional fields that are required
    // by default, only the Tweet ID and text fields are returned
    const params = {
        'query': '#' + hash,
        'expansions': 'author_id',
        'max_results': 100,
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        console.log("Successfully searched " + numTweet + " for hashtag: " + hash);
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}
  
module.exports = {
  searchHashtag
};