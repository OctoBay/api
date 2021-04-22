const axios = require('axios')

module.exports = (req, res) => {
  let username = req.params.username
  axios
    .post(
      'https://api.github.com/graphql',
      {
        query: `query($username:String!) {
          user(login: $username) {
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
        }`,
        variables: {
          username,
        },
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
        res.json(data.data.data.user)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
