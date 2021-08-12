This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Environment variables

The following environment variables are used in this project.<br>
`REACT_APP_API_URL=https://api-dev.dlr.aws.unit.no`

To use mock data, you need to add this variable to the .env file:<br>
`REACT_APP_USE_MOCK=true`

## AWS Codebuild settings:

Must run on Linux in privileged mode

## Available Scripts

In the project directory, you can run:

### `npm start`

(environment priority: .env.development.local | .env.local | .env.development | .env)

### `npm run start:development`

### `npm run start:production`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run test:cypress`

Runs cypress tests

### `npm run build`

(environment priority: .env.production.local | .env.local | .env.production | .env)

### `npm run build:development`

### `npm run build:production`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
