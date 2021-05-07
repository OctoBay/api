const axios = require('axios')

module.exports = (req, res) => {
  axios
    .get('https://api.github.com/user', {
      headers: {
        Authorization: req.headers.authorization,
      },
    })
    .then((githubUser) => {
      githubUser.data.ethAddresses = []
      githubUser.data.incomingDeposits = []
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
            githubUserId: githubUser.data.node_id,
          },
        })
        .then((data) => {
          if (data.data.errors) {
            res.status(404).json(data.data.errors)
          } else {
            githubUser.data.ethAddresses = data.data.data.user.addresses
            githubUser.data.incomingDeposits = data.data.data.user.deposits
            res.json(githubUser.data)
          }
        })
        .catch(() => {
          // return a github user object in any case
          res.json(githubUser.data)
        })
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
