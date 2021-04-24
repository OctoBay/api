require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

const userAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
    next()
  } else {
    res.status(401).send('Unauthorized: No access token provided.')
  }
}

const appAuth = (req, res, next) => {
  req.headers.authorization = 'bearer ' + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  next()
}

app.post('/github/access-token', require('./controllers/github/access-token'))
app.get('/github/user/:username', require('./controllers/github/user'))
app.get('/github/user-by-id/:githubUserId', require('./controllers/github/user-by-id'))
app.get('/github/repository/:owner/:repo', require('./controllers/github/repository'))
app.get('/github/organization/:name', require('./controllers/github/organization'))
app.get('/github/issue/:owner/:repo/:number', require('./controllers/github/issue'))
app.get('/github/issue-by-id/:issueId', require('./controllers/github/issue-by-id'))
app.get('/github/discussion/:owner/:repo/:number', require('./controllers/github/discussion'))
app.get('/github/discussion-by-id/:discussionId', require('./controllers/github/discussion-by-id'))
app.get('/github/pullrequest/:owner/:repo/:number', require('./controllers/github/pullrequest'))
app.get('/github/pullrequest-by-id/:prId', require('./controllers/github/pullrequest-by-id'))
app.get('/github/forks/:owner/:repo', appAuth, require('./controllers/github/forks'))
app.get('/github/is-repo-admin/:user/:repoOwner/:repoName', userAuth, require('./controllers/github/is-repo-admin'))
app.get('/github/linked-pullrequests/:issueId', require('./controllers/github/linked-pullrequests'))
app.get('/github/can-withdraw-from-issue/:githubUserId/:issueId', require('./controllers/github/can-withdraw-from-issue'))

app.get('/twitter/user/:accountId', require('./controllers/twitter/user'))

app.get('/graph/issues', require('./controllers/graph/issues'))
app.get('/graph/issue/:issueId', require('./controllers/graph/issue'))
app.get('/graph/oracles', require('./controllers/graph/oracles'))
app.get('/graph/departments', require('./controllers/graph/departments'))
app.get('/graph/user/:githubUserId', require('./controllers/graph/user'))
app.get('/graph/user-by-address/:ethAddress', require('./controllers/graph/user-by-address'))
app.get('/graph/outgoing-user-deposits/:ethAddress', require('./controllers/graph/outgoing-user-deposits'))
app.get('/graph/permission-nfts-by-owner/:ownerAddress', require('./controllers/graph/permission-nfts-by-owner'))

module.exports = app
