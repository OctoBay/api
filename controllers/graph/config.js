const axios = require('axios')

module.exports = (req, res) => {
  const octobayAddress = req.params.octobayAddress.toLowerCase()
  axios
    .post(process.env.THEGRAPH_ENDPOINT, {
      query: `query($octobayAddress:String!) {
        config(id: $octobayAddress) {
          owner
          trustedForwarder
          userAddressStorage
          oracleStorage
          depositStorage
          octobayGovernor
          octobayGovNFT
          ethUSDPriceFeed
        }
      }`,
      variables: {
        octobayAddress,
      },
    })
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.config)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
