const { claimAdapter } = require('@octobay/adapters')

module.exports = (req, res) => {
  let githubUser = req.params.githubUser
  let issueId = req.params.issueId

  claimAdapter(githubUser, issueId).then(result => {
    if (releasedByCommand || releasedByPullRequest) {
      res.json(true)
    } else {
      res.json(false)
    }
  }).catch(error => {
    res.status(500).json(error)
  })
}
