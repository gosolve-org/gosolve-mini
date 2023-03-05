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

## Firebase notes (not relevant for local setup)
-   Setting up a new database requires going through the authentication and firestore database setups
    -   For authorisation, add authorised domains under authentication -> settings
    -   Add env variables to deploy/local which can be found in project settings -> general -> your apps (search for `process.env` to see which ones are needed)
