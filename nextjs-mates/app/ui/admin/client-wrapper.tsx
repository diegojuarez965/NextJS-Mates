'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/app/lib/service-worker-registration';
import { getPermissionAndToken } from '@/app/lib/notifications';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  // Registro del service worker y solicitud de permisos
  useEffect(() => {
    registerServiceWorker();
    getPermissionAndToken();
  }, []);

  return <>{children}</>;
}
