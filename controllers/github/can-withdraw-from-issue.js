const axios = require('axios')

const getIssueClosedEvents = (issueId, after, result = { closedEvents: [], body: '' }) => {
  return axios.post(
    'https://api.github.com/graphql',
    {
      query: `query {
        rateLimit {
          limit
          cost
          remaining
          resetAt
        }
        node(id:"${issueId}") {
          ... on Issue {
            body
            timelineItems(itemTypes: [CLOSED_EVENT], first: 1${after ? ', after: "' + after + '"' : ''}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                ... on ClosedEvent {
                  closer {
                    ... on PullRequest {
                      author {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`
    },
    {
      headers: {
        Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
      }
    }
  ).then(res => {
    result.body = res.data.data.node.body
    result.closedEvents.push(...res.data.data.node.timelineItems.nodes)
    if (res.data.data.node.timelineItems.pageInfo.hasNextPage) {
      return getIssueClosedEvents(issueId, res.data.data.node.timelineItems.pageInfo.endCursor, result)
    } else {
      return result
    }
  }).catch(e => {
    res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
  })
}

module.exports = (req, res) => {
  let githubUser = req.params.githubUser
  let issueId = req.params.issueId

  getIssueClosedEvents(issueId).then(result => {
    let releasedByPullRequest = false
    result.closedEvents.forEach(closedEvent => {
      if (closedEvent.closer && closedEvent.closer.author.login === githubUser) {
        releasedByPullRequest = true
      }
    })

    const releaseCommandRegex = new RegExp(`^(\\s+)?@OctoBay([ ]+)release([ ]+)to([ ]+)@${githubUser}(\\s+)?$`, 'igm')
    const releasedByCommand = !!result.body.match(releaseCommandRegex)

    if (releasedByCommand || releasedByPullRequest) {
      res.json(true)
    } else {
      res.json(false)
    }
  }).catch(error => {
    res.status(500).json(error)
  })
}
