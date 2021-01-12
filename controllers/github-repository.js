require('dotenv').config();
const axios = require('axios')

module.exports = (req, res) => {
  let owner = req.params.owner
  let repo = req.params.repo
  axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query {
  repository(owner: "${owner}", name:"${repo}") {
    id
    name
    url
    homepageUrl
    createdAt
    description
    collaborators {
      totalCount
    }
    stargazerCount
    forkCount
    primaryLanguage {
      name
      color
    }
    owner {
      login
      url
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
      res.json(data.data.data.repository)
    }).catch(e => res.json({ error: 1 }))
}
