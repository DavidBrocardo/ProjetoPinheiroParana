import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Verifica se as chaves básicas existem no ambiente
const hasFirebaseConfig = !!import.meta.env.VITE_FIREBASE_API_KEY;

let app: any = null;
let db: any = null;
let storage: any = null;
let auth: any = null;
let rtdb: any = null;

if (hasFirebaseConfig) {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
        rtdb = getDatabase(app);
    } catch (error) {
        console.error("Falha ao inicializar o Firebase:", error);
    }
} else {
    console.warn(
        "Avisos do Firebase: Chaves de API ausentes. Por favor, configure o arquivo .env " +
        "na raiz do projeto usando o arquivo .env.example como modelo para que as funcionalidades " +
        "de banco de dados funcionem corretamante."
    );
}

export { db, storage, auth, rtdb };
export default app;