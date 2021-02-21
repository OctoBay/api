const { userAccessToken } = require('@octobay/adapters')

module.exports = (req, res) => {
  let code = req.body.code

  userAccessToken(code).then(result => {
    if (result.error) {
      res.status(500).send(result.error)
    } else {
      res.json({ accessToken: result.accessToken })
    }
  }).catch(e => {
    res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
  })
}
