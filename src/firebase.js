import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6_BRRbrR7NDb2a9QPkTR5oz0o9FjcNa4",
  authDomain: "agenda-ggmw.firebaseapp.com",
  databaseURL: "https://agenda-ggmw-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "agenda-ggmw",
  storageBucket: "agenda-ggmw.firebasestorage.app",
  messagingSenderId: "411608997404",
  appId: "1:411608997404:web:94bfcfea00cdd1d1e909d9",
  measurementId: "G-NTZNKKWQYJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
