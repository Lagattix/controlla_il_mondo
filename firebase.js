import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAj7tnUKJe0z9s5s9_IP0jBC_C01gJNATw",
  authDomain: "controlla-il-mondo.firebaseapp.com",
  projectId: "controlla-il-mondo",
  storageBucket: "controlla-il-mondo.firebasestorage.app",
  messagingSenderId: "800513797892",
  appId: "1:800513797892:web:65681195d74b68c6f0ea51"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
