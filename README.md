This is a [Next.js](https://nextjs.org/) project with Tailwind and Firebase

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder structure

```
├── components
│   ├── common // Common components used throughout app
│   ├── pages // Specific components used in each page, follows page structure
├── constants
├── context
├── models // Data structures used in Firebase
├── pages // Pages with folder structure to follow URL
│   ├── api // APIs used to interact with Firebase
├── styles // App styles
├── utils // Mainly Firebase access but can put others here
```

## Firebase notes

-   Setting up a new database requires going through the authentication and firestore database setups
    -   For authorisation, add authorised domains under authentication -> settings
    -   Add env variables to deploy/local which can be found in project settings -> general -> your apps (search for `process.env` to see which ones are needed)
-   To get started, add locations and categories to the db under `/categories/{autoID}/{category: Covid19}`, `/locations/{autoID}/{location: Belgium}`
    -   Create a `topicId` by visiting the dynamic page and saving some content, some functionality may not work without this id
-   Some text sanitization may need to be added for locations/categories with `-` due to dynamic URLs
-   Check out security rules to protect data read/writes (Firestore Database -> Rules)
-   Create indexes for compound queries to work, matching id and ordering for 4 queries so far (Firestore Database -> Indexes)
-   allowList found under admin collection
-   Some limitations with Firebase/depending on product direction:
    -   Search could be with tags/another service like Angolia/generate queries
    -   Pagination could be with generated pointers updated at intervals/counters
    -   Usernames are added to `authorUsername` on post/action creation - to protect user data, only users can access their own data. To get around this, could store public facing data in another place such as `publicUser` and allow that to be accessed for updated usernames
-   Admin collection could be used to monitor stats/admin functionality

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
