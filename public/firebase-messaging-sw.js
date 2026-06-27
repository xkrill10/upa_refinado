importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "INSIRA_SUA_API_KEY_AQUI",
  authDomain: "INSIRA_SEU_AUTH_DOMAIN_AQUI",
  projectId: "INSIRA_SEU_PROJECT_ID_AQUI",
  storageBucket: "INSIRA_SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "INSIRA_SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "INSIRA_SEU_APP_ID_AQUI"
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
