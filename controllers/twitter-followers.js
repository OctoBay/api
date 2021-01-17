const axios = require('axios')
const cache = require('memory-cache')
const Twitter = require('twitter-lite')

const twApp = new Twitter({
  subdomain: 'api',
  version: '1.1',
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: process.env.TWITTER_APP_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_APP_SECRET
})

module.exports = (req, res) => {
  let accountId = req.params.accountId

  const followers = cache.get('twitter-followers-' + accountId)
  if (followers) {
    res.json(followers)
  } else {
    twApp.get('users/show', {
      user_id: accountId
    }).then(user => {
      cache.put('twitter-followers-' + accountId, user.followers_count, 5 * 60 * 1000)
      res.json(user.followers_count)
    }).catch(error => {
      res.status(500).json(error)
    })
  }
};
