const axios = require('axios')

module.exports = (req, res) => {
  const issueId = req.params.issueId
  axios.post(
    process.env.THEGRAPH_ENDPOINT,
    {
      query: `query($issueId:ID!) {
        issue(id: $issueId) {
          status
          deposits {
            id
            amount
            from
          }
        }
      }`,
      variables: {
        issueId
      }
    }
  ).then(data => {
    if (data.data.errors) {
      res.status(404).json(data.data.errors)
    } else {
      res.json(data.data.data.issue)
    }
  }).catch((e) => {
    res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
  })
}
