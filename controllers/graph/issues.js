const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const cacheKey = 'graph-issues'
  const cacheExpire = 5 * 60 * 1000
  const issues = cache.get(cacheKey)
  if (issues) {
    res.json(issues)
  } else {
    axios.post(
      process.env.THEGRAPH_ENDPOINT,
      {
        query: `{
          issues(first: 10) {
            id
            deposits {
              id
              amount
              from
            }
          }
        }`
      }
    ).then(data => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        cache.put(cacheKey, data.data.data.issues, cacheExpire)
        res.json(data.data.data.issues)
      }
    }).catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
