const githubAccessTokenController = require('./controllers/github-access-token')
const githubUserController = require('./controllers/github-user')
const githubRepositoryController = require('./controllers/github-repository')
const githubIssueController = require('./controllers/github-issue')
const githubIssueByIdController = require('./controllers/github-issue-by-id')
const githubPullRequestController = require('./controllers/github-pullrequest')

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.post('/github-access-token', githubAccessTokenController)
app.get('/github-user/:username', githubUserController)
app.get('/github-repository/:owner/:repo', githubRepositoryController)
app.get('/github-issue/:owner/:repo/:number', githubIssueController)
app.get('/github-issue-by-id/:issueId', githubIssueByIdController)
app.get('/github-pullrequest/:owner/:repo/:number', githubPullRequestController)

app.listen(port, () => {
  console.log(`OctoBay API listening at http://localhost:${port}`)
})
