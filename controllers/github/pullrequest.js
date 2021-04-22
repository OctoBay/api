const axios = require('axios');

module.exports = (req, res) => {
  let owner = req.params.owner;
  let repo = req.params.repo;
  let number = parseInt(req.params.number);
  axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query($owner: String!, $repo: String!, $number: Int!) {
          repository(owner: $owner, name:$repo) {
            pullRequest(number: $number) {
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
        variables: { owner, repo, number }
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
        res.json(data.data.data.repository.pullRequest);
      }
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
    });
};
