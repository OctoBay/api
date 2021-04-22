const axios = require('axios')

module.exports = (req, res) => {
  const ethAddress = req.params.ethAddress
  axios.post(
    process.env.THEGRAPH_ENDPOINT,
    {
      query: `query($ethAddress:String!) {
        userDeposits(where: { from: $ethAddress }) {
          id
          amount
          user {
            id
          }
        }
      }`,
      variables: {
        ethAddress
      },
    }
  ).then(data => {
    if (data.data.errors) {
      res.status(404).json(data.data.errors)
    } else {
      res.json(data.data.data.userDeposits)
    }
  }).catch((e) => {
    res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
  })
}
