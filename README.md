# OctoBay API

## GitHub

<details>
  <summary>Access Token</summary>

  ### Get an access token for a GitHub user.

  The auth code from `https://github.com/login/oauth/authorize)` can be exchanged for an access token here.

  ```http
  POST /github/access-token
  ```
  #### Body
  |Parameter|Default|Description|
  |-|-|-|
  |`code`|`null`|The auth code from the GitHub redirect.|

  #### Response
  |Code|Type|Description|
  |-|-|-|
  |200|`String`|The GitHub user's access token.|
  |500|`Object`|The error object. The code was probably wrong or expired.|

</details>

<details>
  <summary>User</summary>

  ### Get GitHub.

  Get a user by username.

  ```http
  GET /github/user/:username
  ```
  #### Parameters
  |Parameter|Default|Description|
  |-|-|-|
  |`username`|`null`|A GitHub username.|

  #### Response
  |Code|Type|Description|
  |-|-|-|
  |200|`Object`|The GitHub user's account data.|
  |404|`Object`|User not found.|
  |500|`Object`|GitHub error.|

</details>

## The Graph

<details>
  <summary>Issues</summary>

  ### Get all Issues.

  Get all issues that are currently indexed in the OctoBay subgraph. Results are cached.

  ```http
  GET /graph/issues
  ```
  #### Query
  |Parameter|Default|Description|
  |-|-|-|
  |`filter`|`null`|(Not yet implemented yet)|
  |`order`|`desc`|(Not yet implemented yet)|
  |`orderBy`|`depositSize`|(Not yet implemented yet)|

  #### Response
  |Code|Type|Description|
  |-|-|-|
  |200|`Array`|An array of issues/bounties.|
  |500|`Object`|The error object. Calling the graph endpoint failed.|

</details>
