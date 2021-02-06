const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const issues = cache.get('graph-issues')
  if (issues) {
    res.json(issues)
  } else {
    axios.post(
      'https://api.thegraph.com/subgraphs/name/octobay/octobay',
      {
        query: `{
    issues(first: 10) {
      id
      deposits
    }
  }`
      }
    ).then(response => {
      cache.put('graph-issues', response.data.data.issues, 5 * 60 * 1000)
      res.json(response.data.issues)
    }).catch((e) => {
      res.status(500, JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
