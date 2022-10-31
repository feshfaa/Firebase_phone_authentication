import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREbaSE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREbaSE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREbaSE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREbaSE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREbaSE_APP_ID
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;