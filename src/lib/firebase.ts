import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase } from "firebase/database";

let app: FirebaseApp;

const firebaseConfig = {
  apiKey: "AIzaSyAh0pKYjL-8VDl4BwKpM16ds7crXmykwVI",
  authDomain: "final-bsc-project.firebaseapp.com",
  databaseURL: "https://final-bsc-project-default-rtdb.firebaseio.com",
  projectId: "final-bsc-project",
  storageBucket: "final-bsc-project.appspot.com",
  messagingSenderId: "167783047234",
  appId: "1:167783047234:web:5ac2853e48cee2c36bcddb",
};

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

export const rtdb = getDatabase(app);
