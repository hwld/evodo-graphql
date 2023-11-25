import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

const app = initializeApp(
  process.env.NODE_ENV === 'production'
    ? {
        credential: credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || '',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
          privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
        }),
      }
    : {},
);

export const firebaseAuth = getAuth(app);
