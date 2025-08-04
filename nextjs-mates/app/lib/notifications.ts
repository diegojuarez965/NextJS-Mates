import { getMessagingInstance, getToken } from '@/app/lib/firebase';

export async function getPermissionAndToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  if (Notification.permission === 'denied') {
    console.warn('Permiso de notificaciones bloqueado');
    return null;
  }

  // Solicita permiso si no está concedido
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permiso de notificaciones denegado por usuario');
      return null;
    }
  }

  // Intenta recuperar token guardado localmente
  const localToken = localStorage.getItem('fcmToken');
  if (localToken) {
    console.log('🔑 Token FCM desde localStorage:', localToken);
    return localToken;
  }

  // Obtiene instancia de messaging (Firebase)
  const messaging = getMessagingInstance();
  if (!messaging) {
    console.error('No se pudo obtener messaging');
    return null;
  }

  // Solicita nuevo token FCM al servicio
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
  });

  if (token) {
    localStorage.setItem('fcmToken', token);
    console.log('✅ Nuevo token FCM generado:', token);
    return token;
  } else {
    console.error('No se pudo obtener el token FCM');
    return null;
  }
}
