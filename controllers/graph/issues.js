const axios = require('axios')

module.exports = (req, res) => {
  axios
    .post(process.env.THEGRAPH_ENDPOINT, {
      query: `{
        issues(first: 10) {
          id
          status
          deposits {
            id
            amount
            from
          }
        }
      }`,
    })
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.issues)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
