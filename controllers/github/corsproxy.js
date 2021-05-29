const axios = require('axios')

// https://github.com/github/feedback/discussions/3622
// https://gist.github.com/arifmahmudrana/26df8f522d88e6199e5650c9a550a61e
module.exports = (req, res) => {
  axios
    .post(
      'https://api.github.com/graphql',
      {
        query: req.body.query,
        variables: req.body.variables,
      },
      {
        headers: {
          Authorization: req.headers.authorization,
          'GraphQL-Features': 'discussions_api',
        },
        responseType: 'stream',
      }
    )
    .then((response) => {
      for (const key in response.headers) {
        if (response.headers.hasOwnProperty(key)) {
          const element = response.headers[key]
          res.header(key, element)
        }
      }
      res.status(response.status)
      response.data.pipe(res)
    })
    .catch(({ response }) => {
      for (const key in response.headers) {
        if (response.headers.hasOwnProperty(key)) {
          const element = response.headers[key]
          res.header(key, element)
        }
      }
      res.status(response.status)
      response.data.pipe(res)
    })
}
