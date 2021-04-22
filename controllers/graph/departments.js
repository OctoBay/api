const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  axios
    .post(process.env.THEGRAPH_ENDPOINT, {
      query: `{
        governanceDepartments(first: 100) {
          id
          projectId
          tokenAddress
          name
          symbol
          minQuorum
          requiredSharesToCreateProposals
          holders {
            id
            ethAddress
            balance
          }
          nfts {
            id
            ownerAddress
            permissions
          }
          proposals {
            id
            count
            quorum
            startDate
            endDate
            balanceSnapshotId
            department {
              tokenAddress
              projectId
            }
            votes {
              id
              holder {
                id
                ethAddress
                balance
              }
              percentage
            }
          }
        }
      }`,
    })
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.governanceDepartments)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
