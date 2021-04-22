const { bountyIsReleased } = require('@octobay/adapters')

module.exports = (req, res) => {
  let githubUserId = req.params.githubUserId
  let issueId = req.params.issueId

  bountyIsReleased(githubUserId, issueId)
    .then((result) => {
      if (result.releasedByCommand || result.releasedByPullRequest) {
        res.json(true)
      } else {
        res.json(false)
      }
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}
