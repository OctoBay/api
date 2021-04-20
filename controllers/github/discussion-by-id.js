const axios = require('axios');

module.exports = (req, res) => {
  let discussionId = req.params.discussionId;
  axios
    .post(
      "https://api.github.com/graphql",
      {
        query: `query($discussionId: ID!) {
          node(id: $discussionId) {
            ... on Discussion {
              id
              title
              url
            }
          }
        }`,
        variables: { discussionId }
      },
      {
        headers: {
          Authorization: "bearer " + process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
          'GraphQL-Features': 'discussions_api'
        }
      }
    )
    .then(data => {
      if (data.data.errors) {
        res.status(404).json(data.data.errors);
      } else {
        res.json(data.data.data.node);
      }
    }).catch(e => {
      res.status(500).send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
    });
};
