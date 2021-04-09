const axios = require('axios')

module.exports = (req, res) => {
  let owner = req.params.owner
  let repo = req.params.repo
  let number = req.params.number
  axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query {
  repository(owner: "${owner}", name:"${repo}") {
    id
    owner {
      id
    }
    discussion(number: ${number}) {
      id
      title
    }
  }
}`
      },
      {
        headers: {
          Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
          'GraphQL-Features': 'discussions_api'
        }
      }
    )
    .then(data => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.repository)
      }
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
