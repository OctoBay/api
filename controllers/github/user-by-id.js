const axios = require('axios')

module.exports = (req, res) => {
  let githubUserId = req.params.githubUserId
  axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query($githubUserId:ID!) {
          node(id: $githubUserId) {
            ... on User {
              id
              createdAt
              updatedAt
              login
              url
              avatarUrl
              location
              name
              websiteUrl
              twitterUsername
              email
              hasSponsorsListing
              isHireable
            }
          }
        }`,
        variables: {
          githubUserId
        }
      },
      {
        headers: {
          Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
        }
      }
    )
    .then(data => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.node)
      }
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
