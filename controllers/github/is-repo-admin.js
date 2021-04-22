const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const user = req.params.user
  const repoOwner = req.params.repoOwner
  const repoName = req.params.repoName
  const cacheKey = `github-is-repo-admin-${user}-${repoOwner}-${repoName}`
  const cacheExpire = 1 * 60 * 1000

  let isAdmin = cache.get(cacheKey)
  // lookup/refresh only if not set (expired) or true
  // "NOT admin" is a state that can be cached, "IS admin" should not be cached
  if (isAdmin !== false) {
    axios
      .post(
        'https://api.github.com/graphql',
        {
          query: `query($repoOwner: String!, $repoName: String!, $user: String!) {
            repository(owner: $repoOwner, name: $repoName) {
              collaborators(query: $user) {
                edges {
                  permission
                }
                nodes {
                  login
                }
              }
            }
          }`,
          variables: { repoOwner, repoName, user },
        },
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      )
      .then((data) => {
        if (data.data.errors) {
          res.status(404).json(data.data.errors)
        } else {
          isAdmin = !!data.data.data.repository && data.data.data.repository.collaborators.edges[0].permission.toLowerCase() === 'admin'
          cache.put(cacheKey, isAdmin, cacheExpire)
          res.json(isAdmin)
        }
      })
      .catch((e) => {
        res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      })
  } else {
    res.json(isAdmin)
  }
}
