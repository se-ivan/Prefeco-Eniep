import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const REQUIRED_FIREBASE_VALUES: Array<[string, string | undefined]> = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
];

export function getFirebaseStorage() {
  const missing = REQUIRED_FIREBASE_VALUES.filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Faltan variables de entorno de Firebase: ${missing.join(", ")}`);
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getStorage(app);
}

export async function ensureFirebaseUploadSession() {
  if (typeof window === "undefined") {
    return;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);

  if (auth.currentUser) {
    return;
  }

  try {
    await signInAnonymously(auth);
  } catch {
    throw new Error(
      "No fue posible autenticar en Firebase Storage. Habilita Anonymous Auth en Firebase Console > Authentication > Sign-in method."
    );
  }
}
