# OctoBay API

![OctoBay API Dev](https://github.com/octobay/api/actions/workflows/node.js.yml/badge.svg)

## GitHub

<details>
  <summary>GitHub Personal Access Token</summary>
  ### Get a GitHub Personal Access Token
  
  [Follow these instructions](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to get your GitHub Personal Access Token.

  Create the token with the following permissions:
  - public_repo
  - user:email

  Put this personal access token in the .env file for the `GITHUB_PERSONAL_ACCESS_TOKEN` variable.

  <summary>Authorization Access Token</summary>

  ### Get an access token for a GitHub user.

  #### Option 1: Create a GitHub OAuth2 App and Get a token using the frontend
  
  ##### Step 1: Create OAuth App
  Our frontend and some backend calls (like is-repo-admin) expects an GitHub OAuth2 token.

  Let's get you a token.

  First create an OAuth2 Github app. Go to <b>Settings -> Developer settings -> OAuth Apps</b>

  Set callback url to:

  Application Name: anything
  Homepage url: could be anything, but just do `https://octobay.uber.space/`
  Authorization callback URL: MUST be `http://localhost:3000/auth/github`

  Create the application.

  In `.env`, set the following to your OAuth2 apps information:

  ```
  GITHUB_CLIENT_ID=<YOUR_GITHUB_CLIENT_ID>
  GITHUB_CLIENT_SECRET=<YOUR_GITHUB_CLIENT_SECRET>
  ```

  ##### Step 2: Login from frontend

  Set the following parameters in the app frontend
  
  ```
  API_URL=http://localhost:3001
  GITHUB_CLIENT_ID=<THE CLIENT ID OF THE OUATH2 APP YOU CREATED IN STEP 1>
  ```

  Boot the api and app, and follow the login on the frontend.

  You should now have an OAuth2 token beginning with `gho_` in you Applications -> Local Storage.

  Use this with a header of `Authorization : Bearer <YOUR TOKEN>` to make authenticated API calls.

  #### Option 2: Intercept Authorization Code
  The auth code from `https://github.com/login/oauth/authorize` can be exchanged for an access token here.

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
