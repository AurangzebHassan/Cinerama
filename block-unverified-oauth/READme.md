# block-unverified-oauth

Appwrite Function to block OAuth session creation for users whose email isn't verified.



## Purpose

    When an OAuth session is created (Appwrite event `account.sessions.oauth2.create`), this function fetches the user record using the Admin SDK. If `emailVerification === false`, it deletes all sessions for that user (preventing an unverified account from being linked/used).



## Required environment variables (set in Appwrite Console for the Function)

    - APPWRITE_API_KEY : Admin API key (must allow Users read & deleteSessions)
    - APPWRITE_FUNCTION_API_ENDPOINT : Appwrite API endpoint (e.g. https://cloud.appwrite.io/v1)
    - APPWRITE_FUNCTION_PROJECT_ID : Your project id



## How to deploy

    1. Zip this folder (`package.json` + `main.js` + `README.md`).
    2. Create a new Function in Appwrite Console (Node runtime).
    3. Upload the zip, set entry file to `main.js`.
    4. Add environment variables above.
    5. Add trigger: `account.sessions.oauth2.create`.
    6. Deploy / enable.



## Notes

    - Do NOT expose APPWRITE_API_KEY to clients.
    - Optionally remove identities (unlink provider) if you want that behavior — commented in code.