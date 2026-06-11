import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase Config copied from screenshot
const firebaseConfig = {
  apiKey: "AIzaSyDGlEa3kbLJDyPuiLGMKD_YFgnf0QEc9fY",
  authDomain: "gen-lang-client-0117387303.firebaseapp.com",
  projectId: "gen-lang-client-0117387303",
  storageBucket: "gen-lang-client-0117387303.firebasestorage.app",
  messagingSenderId: "771634071092",
  appId: "1:771634071092:web:c4903786e2b0e458b06c61",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFirebaseNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // NOTE: We need the VAPID KEY from Firebase Console to securely connect Web Push
      // The user needs to add it in the .env file later
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

      if (!vapidKey) {
        throw new Error(
          "VAPID Key do Firebase não encontrada. Configure VITE_FIREBASE_VAPID_KEY no .env",
        );
      }

      const token = await getToken(messaging, { vapidKey });
      return token;
    } else {
      throw new Error("Permissão para notificações negada pelo usuário.");
    }
  } catch (error) {
    console.error("Erro ao gerar token FCM:", error);
    throw error;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
