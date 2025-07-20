import admin from 'firebase-admin';
import { config } from 'dotenv';

// Force load environment variables from .env.local for server-side code.
// This is necessary for the Firebase Admin SDK to find its credentials.
config({ path: '.env.local' });

// This is a server-side only file.
// Do not import this on the client.

let app: admin.app.App;

/**
 * Initializes and returns the Firebase Admin SDK App instance.
 * It ensures initialization only happens once.
 * 
 * This function relies on environment variables for Firebase credentials.
 * These must be set up correctly in both your local and deployed environments.
 * 
 * --- LOCAL SETUP ---
 * 1. Create a file named `.env.local` in the root of your project.
 * 2. Get your credentials from your Firebase project's service account JSON file.
 *    (Firebase Console > Project Settings > Service accounts > Generate new private key)
 * 3. Add the following to your `.env.local` file:
 * 
 *    FIREBASE_PROJECT_ID="your-project-id"
 *    FIREBASE_CLIENT_EMAIL="your-client-email"
 *    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-private-key...\n-----END PRIVATE KEY-----\n"
 * 
 * --- VERCEL SETUP ---
 * 1. Go to your project dashboard on Vercel.
 * 2. Go to Settings > Environment Variables.
 * 3. Add the same three variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 *    with the values from your service account JSON file.
 * 4. Redeploy your application for the variables to take effect.
 */
function getFirebaseAdmin() {
  if (app) {
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase credentials not found. Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment variables.'
    );
  }

  if (!admin.apps.length) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // When stored in environment variables, the private key's newlines might be escaped.
          // This line ensures they are correctly formatted back to actual newlines.
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
      throw new Error('Failed to initialize Firebase Admin SDK.');
    }
  } else {
    app = admin.app();
  }

  return app;
}

function getDb() {
    return getFirebaseAdmin().firestore();
}

function getAuth() {
    return getFirebaseAdmin().auth();
}

export const db = getDb();
export const auth = getAuth();
