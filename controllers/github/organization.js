const axios = require('axios')

module.exports = (req, res) => {
  let name = req.params.name
  axios
    .post(
      'https://api.github.com/graphql',
      {
        query: `query($name:String!) {
            organization(login: $name) {
              id
              name
              url
              avatarUrl
              websiteUrl
              createdAt
              description
            }
          }`,
        variables: { name },
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
        res.json(data.data.data.organization)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
