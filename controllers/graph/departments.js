const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const cacheKey = 'graph-departments'
  const cacheExpire = 1 * 60 * 60 * 1000
  const departments = cache.get(cacheKey)
  if (departments) {
    res.json(departments)
  } else {
    axios.post(
      process.env.THEGRAPH_ENDPOINT,
      {
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
              quorum
              discussionId
              startDate
              endDate
              votes {
                id
                holder {
                  id
                  githubUserId
                  ethAddress
                  balance
                }
                percentage
              }
            }
          }
        }`
      }
    ).then(data => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        cache.put(cacheKey, data.data.data.departments, cacheExpire)
        res.json(data.data.data.departments)
      }
    }).catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
