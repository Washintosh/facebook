import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "facebook-dc21a.firebaseapp.com",
  projectId: "facebook-dc21a",
  storageBucket: "facebook-dc21a.appspot.com",
  messagingSenderId: "759411941236",
  appId: "1:759411941236:web:f3e6258359ace19946d621",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
