const axios = require('axios')

module.exports = (req, res) => {
  let username = req.params.username
  axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query {
                  user(login: "${username}") {
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
                }`
      },
      {
        headers: {
          Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
        }
      }
    )
    .then(data => {
      res.json(data.data.data.user)
    })
}
