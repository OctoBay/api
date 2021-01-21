const axios = require('axios')
const cache = require('memory-cache')

module.exports = (req, res) => {
  const user = req.params.user
  const repoOwner = req.params.repoOwner
  const repoName = req.params.repoName
  const cacheKey = `github-is-repo-admin-${user}-${repoOwner}-${repoName}`

  let isAdmin = cache.get(cacheKey)
  // lookup/refresh only if not set (expired) or true
  // "NOT admin" is a state that can be cached, "IS admin" should not
  if (isAdmin !== false) {
    axios
      .post(
        "https://api.github.com/graphql",
        {
          query: `query {
    repository(owner: "${repoOwner}", name:"${repoName}") {
      collaborators(query: "${user}") {
        edges {
          permission
        }
        nodes {
          login
        }
      }
    }
  }`
        },
        {
          headers: {
            Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
          }
        }
      )
      .then(data => {
        isAdmin = !!data.data.data.repository && data.data.data.repository.collaborators.edges[0].permission.toLowerCase() === 'admin'
        cache.put(cacheKey, isAdmin, 5 * 60 * 1000)
        res.json(isAdmin)
      }).catch(e => res.json({ error: 'asd' }))
  } else {
    res.json(isAdmin)
  }
}
