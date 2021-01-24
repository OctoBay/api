const { graphql } = require("@octokit/graphql")
const { createTokenAuth } = require("@octokit/auth");

const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN)

const graphqlClient = graphql.defaults({
  request: {
    hook: auth.hook,
  }
})

module.exports = { graphqlClient }
