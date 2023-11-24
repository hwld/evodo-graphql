import { FirebaseOptions, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDVba2qKYYRjfWg8wp5LxxxQRWf0NER0QI',
  authDomain: 'evodo-graphql.firebaseapp.com',
  projectId: 'evodo-graphql',
  storageBucket: 'evodo-graphql.appspot.com',
  messagingSenderId: '552426755852',
  appId: '1:552426755852:web:f47169e7fe470f6c265b29',
  measurementId: 'G-DV8PNKB6HP',
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
