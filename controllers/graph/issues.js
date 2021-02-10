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
      'https://api.thegraph.com/subgraphs/name/octobay/octobay',
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
    ).then(response => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        cache.put(cacheKey, response.data.data.issues, cacheExpire)
        res.json(response.data.data.issues)
      }
    }).catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
