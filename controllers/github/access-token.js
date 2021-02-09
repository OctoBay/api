const axios = require('axios')

module.exports = (req, res) => {
  let code = req.body.code
  axios
    .post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      accept: 'application/json'
    })
    .then(response => {
      const urlParams = new URLSearchParams(response.data)
      const accessToken = urlParams.get('access_token')
      res.json({ accessToken })
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
