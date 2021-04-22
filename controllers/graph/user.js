const axios = require('axios')

module.exports = (req, res) => {
  const githubUserId = req.params.githubUserId
  axios
    .post(process.env.THEGRAPH_ENDPOINT, {
      query: `query($githubUserId:String!) {
        user(id: $githubUserId) {
          addresses {
            name
            address
          }
          deposits {
            id
            from
            amount
          }
        }
      }`,
      variables: {
        githubUserId,
      },
    })
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.user)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
