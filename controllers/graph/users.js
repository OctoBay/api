const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const cacheKey = 'graph-users'
  const cacheExpire = 60 * 60 * 1000
  const users = cache.get(cacheKey)
  if (users) {
    res.json(users)
  } else {
    axios.post(
      'https://api.thegraph.com/subgraphs/name/octobay/octobay',
      {
        query: `{
          users(first: 100) {
            id
            name
            ethAddress
            status
          }
        }`
      }
    ).then(response => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        cache.put(cacheKey, response.data.data.users, cacheExpire)
        res.json(response.data.data.users)
      }
    }).catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
