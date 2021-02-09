const axios = require('axios')
const cache = require('memory-cache')
const { graphqlClient } = require('./graphql-client')

const getPullRequestConnectEvents = (issueId, after, items = []) => {
  return axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query {
          node(id:"${issueId}") {
            ... on Issue {
              timelineItems(itemTypes: [CONNECTED_EVENT, DISCONNECTED_EVENT, CROSS_REFERENCED_EVENT], first: 50${after ? ', after: "' + after + '"' : ''}) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  ... on ConnectedEvent {
                    subject {
                      ... on PullRequest {
                        id
                      }
                    }
                  }
                  ... on DisconnectedEvent {
                    subject {
                      ... on PullRequest {
                        id
                      }
                    }
                  }
                  ... on CrossReferencedEvent {
                    willCloseTarget
                    source {
                      ... on PullRequest {
                        id
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
    )
    .then(res => {
      items.push(...res.data.data.node.timelineItems.nodes)
      if (res.data.data.node.timelineItems.pageInfo.hasNextPage) {
        return getPullRequestConnectEvents(issueId, res.data.data.node.timelineItems.pageInfo.endCursor, items)
      } else {
        return items
      }
    }).catch(e => e)
}

module.exports = (req, res) => {
  const issueId = req.params.issueId
  const cacheKey = 'github-linked-pullrequests-' + issueId
  let linkedPullRequests = cache.get(cacheKey) || []
  if (linkedPullRequests.length) {
    res.json(linkedPullRequests)
  } else {
    getPullRequestConnectEvents(issueId).then(connectionEvents => {
      connectionEvents.forEach(connectionEvent => {
        if (connectionEvent.subject) {
          if (linkedPullRequests.includes(connectionEvent.subject.id)) {
            linkedPullRequests = linkedPullRequests.filter(id => id != connectionEvent.subject.id)
          } else {
            linkedPullRequests.push(connectionEvent.subject.id)
          }
        } else if (connectionEvent.source && connectionEvent.willCloseTarget) {
          linkedPullRequests.push(connectionEvent.source.id)
        }
      })
      cache.put(cacheKey, linkedPullRequests, 5 * 60 * 1000)
      res.json(linkedPullRequests)
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    })
  }
}
