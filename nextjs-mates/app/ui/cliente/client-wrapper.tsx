'use client';

import { useEffect } from 'react';
import { getMessagingInstance, onMessage } from '@/app/lib/firebase';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { registerServiceWorker } from '@/app/lib/service-worker-registration';
import { getPermissionAndToken } from '@/app/lib/notifications';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker(); // Registrar service worker para notificaciones
    getPermissionAndToken(); // Solicitar permiso y obtener token de FCM

    // Configurar listener para notificaciones en primer plano
    if (typeof window === 'undefined') return; // Asegurarse de que estamos en el cliente
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.warn('Firebase Messaging no disponible');
      return;
    }
    // Listener para notificaciones en primer plano
    const unsubscribe = onMessage(messaging, async (payload) => {
      console.log('Notificación foreground:', payload);
      // Mostrar notificación usando react-toastify
      toast.info(
        `${payload.data?.title ?? 'Título'}: ${payload.data?.body ?? 'Cuerpo'}`,
        {
          icon: (
            <Image
              src="/icons/icon-192x192.png"
              alt="icon"
              width={24}
              height={24}
            />
          ),
          position: 'top-right',
          autoClose: 10000,
        }
      );
    });
    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
