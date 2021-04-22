const axios = require('axios')

module.exports = (req, res) => {
  axios
    .post(process.env.THEGRAPH_ENDPOINT, {
      query: `{
        oracles(first: 10) {
          id
          name
          ethAddress
          jobs {
            id
            name
            fee
          }
        }
      }`,
    })
    .then((data) => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors)
      } else {
        res.json(data.data.data.oracles)
      }
    })
    .catch((e) => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
}
