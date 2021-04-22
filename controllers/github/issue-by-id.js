const axios = require('axios')

module.exports = (req, res) => {
  let issueId = req.params.issueId
  axios
    .post(
      'https://api.github.com/graphql',
      {
        query: `query($issueId: ID!) {
          node(id: $issueId) {
            ... on Issue {
              id
              title
              url
              number
              closed
              comments {
                totalCount
              }
              labels(first: 100) {
                edges {
                  node {
                    name
                    color
                  }
                }
              }
              repository {
                name
                primaryLanguage {
                  name
                  color
                }
                owner {
                  login
                }
              }
              author {
                ... on User {
                  login
                  url
                  email
                }
              }
            }
          }
        }`,
        variables: { issueId },
      },
      {
        headers: {
          Authorization: 'bearer ' + process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
        },
      }
    )
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.node)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
