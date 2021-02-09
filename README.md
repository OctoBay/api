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
