const axios = require('axios');
const cache = require('memory-cache');

module.exports = (req, res) => {
  let prId = req.params.prId;
  const cacheKey = 'pullrequest-' + prId;
  let pullRequest = cache.get(cacheKey);
  if (pullRequest) {
    res.json(pullRequest);
  } else {
    axios
      .post(
        "https://api.github.com/graphql",
        {
          query: `query($prId: ID!) {
            node(id: $prId) {
              ... on PullRequest {
                id
                url
                number
                author {
                  ... on User {
                    login
                    url
                    createdAt
                    followers {
                      totalCount
                    }
                  }
                }
                title
                state
                merged
                mergedAt
                createdAt
                changedFiles
          autoMergeRequest {
                  mergeMethod
          }
                reviews {
                  totalCount
                }
                commits {
                  totalCount
                }
                comments {
                  totalCount
                }
                repository {
                  owner {
                    login
                  }
                  createdAt
                  forkCount
                  viewerCanAdminister
                  stargazers {
                    totalCount
                  }
                }
              }
            }
          }`,
          variables: { prId }
        },
        {
          headers: {
            Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN
          }
        }
      )
      .then(data => {
        if (data.data.errors) {
          res.status(404).json(data.data.errors);
        } else {
          cache.put(cacheKey, data.data.data.node, 5 * 60 * 1000);
          res.json(data.data.data.node);
        }
      }).catch(e => {
        res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
      });
  }
};
