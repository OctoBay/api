const request = require('supertest')
const app = require('../app')

const testUser = 'mktcode'
const testIssue = 'MDU6SXNzdWU4MDI4MDIxMjU='
const testRepoName = 'app'
const testRepoOwner = 'octobay'
const otherTestRepoName = 'hello-world'
const otherTestRepoOwner = 'octocat'

describe('GitHub', () => {
  it('User has no withdraw permission for issue.', async () => {
    const res = await request(app).get(`/github/can-withdraw-from-issue/${testUser}/${testIssue}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBe(false)
  })
})
