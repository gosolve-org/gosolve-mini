This is a [Next.js](https://nextjs.org/) project with Tailwind and Firebase.

## First-time setup
```bash
# Installing NPM packages
npm install
(cd firebase/functions/ && npm install)

# Setting up Firebase
firebase login # Log in with your google account that has access to the dev firebase project
(cd firebase/ && firebase use default)
(cd firebase/ && firebase init emulators) # Select Authentication Emulator, Functions Emulator and Firestore Emulator
(cd firebase/ && cp -r exported-dev-data.example exported-dev-data) # Copy basic dummy data required for your emulators

# Setting up environment variables
# These will need to be filled in, ask a team member for the correct values.
cp .env-example .env
(cd firebase/functions/ && cp .env-example .env)
```

## Running firebase emulators
You can connect to either the actual firebase dev app or to your local emulators. It is recommended to use emulators during development:
```bash
cd firebase
npm run dev
```

## Running the front-end
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder structure
```
|── external // External libraries, packages or code that has been forked
|── firebase // Contains all firebase configurations
│   ├── functions // Contains all cloud functions
|── public // Contains all public resources for the Front-end app
|── src // Contains all source code for the Front-end app
│   ├── components
│   |   ├── common // Common components used throughout app
│   |   ├── pages // Specific components used in each page, follows page structure
│   ├── constants
│   ├── context
│   ├── models
│   ├── pages // Pages with folder structure to follow URL
│   │   ├── api // API functionality
│   ├── styles // App styles
│   ├── utils // Utility tools
```

## Continuous Deployment
We don't manually make changes or manually deploy to Firebase or Netlify. The following setup is used for automatic deployments.

### Front-end
This repository is linked to our Netlify:
- All changes to develop are automatically published to dev
- All changes to master trigger a build for staging & production, but need to be manually published

All environment variables & secrets needed for the front-end are stored in Netlify.

### Firebase
The Firebase functions, Firestore rules and indexes are deployed using GitHub Actions in this repository:
- All changes to develop are automatically deployed to dev
- All changes to master trigger a workflow for staging, which requires an approval. Afterwards, this workflow can be promoted to production.

#### Creating a service account for the firebase project
You need a service account json for executing the firebase actions (env variable: GCP_SA_KEY).
Go to Firebase => Project Settings => Service accounts => Manage service account permissions
Then create a new service account and grant the following roles:
- Service Account User
- Cloud Functions Admin
- Cloud Scheduler Admin
- Secret Manager Viewer
- Firebase Rules Admin
- Cloud Datastore Index Admin
- Viewer

Create a json key for this service account, base64 encode it, and save it in the GCP_SA_KEY secret in the correct GitHub environment secret.

## Firebase notes (not relevant for local setup)
-   Setting up a new database requires going through the authentication and firestore database setups
    -   For authorisation, add authorised domains under authentication -> settings
    -   Add env variables to deploy/local which can be found in project settings -> general -> your apps (search for `process.env` to see which ones are needed)
