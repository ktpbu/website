import {getApp, getApps, initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const env = import.meta.env
const firebaseConfig = {
   apiKey: env.FIREBASE_API_KEY ?? env.VITE_FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN ?? env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID ?? env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET ?? env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID ?? env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID ?? env.VITE_FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID ?? env.VITE_FIREBASE_MEASUREMENT_ID
  };

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig); //check for already existing apps 
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);


export {app, auth, storage, firestore}