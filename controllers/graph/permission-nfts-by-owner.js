const axios = require('axios')

module.exports = (req, res) => {
  const ownerAddress = req.params.ownerAddress
  axios
    .post(process.env.THEGRAPH_ENDPOINT, {
      query: `query($ownerAddress:String!) {
        governancePermissionNFTs(where: {ownerAddress: $ownerAddress}) {
          id
          ownerAddress
          permissions
          department {
            id
            projectId
            tokenAddress
            name
            symbol
          }
        }
      }`,
      variables: {
        ownerAddress,
      },
    })
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.governancePermissionNFTs)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
