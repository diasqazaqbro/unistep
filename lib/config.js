import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCF1eFfBA9VPrrA-apajAGXCiHBR4fXCJo",
  authDomain: "stroy-depot.firebaseapp.com",
  projectId: "stroy-depot",
  storageBucket: "stroy-depot.appspot.com",
  messagingSenderId: "169444509821",
  appId: "1:169444509821:web:8fe60d37f1b0fe1cf3c914",
  measurementId: "G-ZZ43LPEXP4",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage();
