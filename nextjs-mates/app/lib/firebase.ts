import { initializeApp, getApps } from 'firebase/app';
import { getMessaging as _getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDWfmyfSoiPZNRFBqfLHGKLfHJLWGIevxY",
  authDomain: "nextjs-mates.firebaseapp.com",
  projectId: "nextjs-mates",
  storageBucket: "nextjs-mates.firebasestorage.app",
  messagingSenderId: "44791023609",
  appId: "1:44791023609:web:df92370669121d6e67df28",
  measurementId: "G-L0R8WKYWY9",
};

let messagingInstance: ReturnType<typeof _getMessaging> | null = null;

// Obtiene o inicializa instancia de Firebase Messaging (solo en cliente)
export function getMessagingInstance() {
  if (typeof window === 'undefined') return null; // Protege contra ejecución SSR

  if (!messagingInstance) {
    // Inicializa app Firebase o reutiliza si ya está
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    messagingInstance = _getMessaging(app);
  }

  return messagingInstance;
}

export { getToken, onMessage };
