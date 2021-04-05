const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const cacheKey = 'graph-oracles'
  const cacheExpire = 24 * 60 * 60 * 1000
  const oracles = cache.get(cacheKey)
  if (oracles) {
    res.json(oracles)
  } else {
    axios.post(
      process.env.THEGRAPH_ENDPOINT,
      {
        query: `{
          oracles(first: 10) {
            id
            name
            ethAddress
            jobs {
              id
              name
              fee
            }
          }
        }`
      }
    ).then(data => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        cache.put(cacheKey, data.data.data.oracles, cacheExpire)
        res.json(data.data.data.oracles)
      }
    }).catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
