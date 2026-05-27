importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDGlEa3kbLJDyPuiLGMKD_YFgnf0QEc9fY",
  authDomain: "gen-lang-client-0117387303.firebaseapp.com",
  projectId: "gen-lang-client-0117387303",
  storageBucket: "gen-lang-client-0117387303.firebasestorage.app",
  messagingSenderId: "771634071092",
  appId: "1:771634071092:web:c4903786e2b0e458b06c61"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Recebeu notificação em background ", payload);
  
  const notificationTitle = payload.notification?.title || "Nova Mensagem UPA Control";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/favicon.ico", // ou uma logo do app
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
