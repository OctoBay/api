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
    issue(number: ${number}) {
      id
      title
      url
      number
      closed
      createdAt
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
}`
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
        res.json(data.data.data.repository.issue)
      }
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
