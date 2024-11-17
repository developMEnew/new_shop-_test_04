import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJCHzwTzaS3PlII3ACceWz1ndF5zuehHs",
  authDomain: "shop-inv-5c4cb.firebaseapp.com",
  projectId: "shop-inv-5c4cb",
  storageBucket: "shop-inv-5c4cb.firebasestorage.app",
  messagingSenderId: "548750176249",
  appId: "1:548750176249:web:6a9d363c70a93ffd04d728",
  measurementId: "G-2TLM3PGJXZ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);