const axios = require('axios')

module.exports = (req, res) => {
  const ethAddress = req.params.ethAddress
  axios.post(
    process.env.THEGRAPH_ENDPOINT,
    {
      query: `query($ethAddress:ID!) {
        userAddress(id: $ethAddress) {
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
    } else if (data.data.data.userAddress) {
      res.json(data.data.data.userAddress.user.id)
    } else {
      res.status(404).json('Not found.')
    }
  }).catch((e) => {
    res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
  })
}
