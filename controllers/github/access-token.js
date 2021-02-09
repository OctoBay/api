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
      const data = new URLSearchParams(response.data)
      if (data.get('error')) {
        res.status(500).send(`${data.get('error')}: ${data.get('error_description')}`)
      } else {
        res.json({ accessToken: data.get('access_token') })
      }
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
