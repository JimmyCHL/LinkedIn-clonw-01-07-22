// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeztgTADphixflbPVhxiMk_VnOVNU06Y8",
  authDomain: "linkedin-clone-1-4-22.firebaseapp.com",
  projectId: "linkedin-clone-1-4-22",
  storageBucket: "linkedin-clone-1-4-22.appspot.com",
  messagingSenderId: "501614820901",
  appId: "1:501614820901:web:4b4006220d7ed1b4f389cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, provider, storage };
