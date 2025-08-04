importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDWfmyfSoiPZNRFBqfLHGKLfHJLWGIevxY",
    authDomain: "nextjs-mates.firebaseapp.com",
    projectId: "nextjs-mates",
    storageBucket: "nextjs-mates.firebasestorage.app",
    messagingSenderId: "44791023609",
    appId: "1:44791023609:web:df92370669121d6e67df28",
    measurementId: "G-L0R8WKYWY9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] 📥 Background Message recibido:', payload);

    const notificationTitle = payload.data?.title || 'Título por defecto';
    const notificationOptions = {
        body: payload.data?.body || 'Cuerpo por defecto',
        icon: '/icons/icon-192x192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});