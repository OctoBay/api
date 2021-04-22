const request = require('supertest')
const app = require('../app')

describe('The Graph', () => {
  it('should return at least one issue', async () => {
    const res = await request(app).get('/graph/issues')
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
  })
})
