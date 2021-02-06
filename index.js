require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.post('/github/access-token', require('./controllers/github/access-token'))
app.get('/github/user/:username', require('./controllers/github/user'))
app.get('/github/repository/:owner/:repo', require('./controllers/github/repository'))
app.get('/github/issue/:owner/:repo/:number', require('./controllers/github/issue'))
app.get('/github/issue-by-id/:issueId', require('./controllers/github/issue-by-id'))
app.get('/github/pullrequest/:owner/:repo/:number', require('./controllers/github/pullrequest'))
app.get('/github/pullrequest-by-id/:prId', require('./controllers/github/pullrequest-by-id'))
app.get('/github/forks/:owner/:repo', require('./controllers/github/forks'))
app.get('/github/is-repo-admin/:user/:repoOwner/:repoName', require('./controllers/github/is-repo-admin'))
app.get('/github/linked-pullrequests/:issueId', require('./controllers/github/linked-pullrequests'))
app.get('/github/can-withdraw-from-issue/:githubUser/:issueId', require('./controllers/github/can-withdraw-from-issue'))

app.get('/twitter/user/:accountId', require('./controllers/twitter/user'))

app.get('/graph/issues', require('./controllers/graph/issues'))

app.listen(port, () => {
  console.log(`OctoBay API listening at http://localhost:${port}`)
})
