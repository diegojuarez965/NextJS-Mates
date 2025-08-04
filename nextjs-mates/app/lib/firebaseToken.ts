import { getMessagingInstance, getToken } from '@/app/lib/firebase';

export async function getOrCreateToken(): Promise<string> {
  // Retorna token guardado localmente si existe
  const localToken = localStorage.getItem('fcmToken');
  if (localToken) {
    console.log('Token FCM desde localStorage:', localToken);
    return localToken;
  }

  // Obtiene instancia de Firebase Messaging
  const messaging = getMessagingInstance();
  if (!messaging) throw new Error('Firebase Messaging no disponible');

  // Solicita nuevo token FCM
  const newToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });

  if (!newToken) throw new Error('No se pudo obtener el token FCM');

  // Guarda y retorna el nuevo token
  localStorage.setItem('fcmToken', newToken);
  console.log('Nuevo token FCM generado:', newToken);
  return newToken;
}
