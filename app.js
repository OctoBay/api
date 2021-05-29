require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

app.post('/github/access-token', require('./controllers/github/access-token'))
app.get('/github/linked-pullrequests/:issueId', require('./controllers/github/linked-pullrequests'))
app.get('/github/can-withdraw-from-issue/:githubUserId/:issueId', require('./controllers/github/can-withdraw-from-issue'))
app.post('/github/corsproxy', require('./controllers/github/corsproxy'))

module.exports = app
