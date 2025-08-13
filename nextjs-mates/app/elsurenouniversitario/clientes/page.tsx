'use client';

import AnimatedWeather from '@/app/ui/cliente/animatedWeather';
import { useWeather } from '@/app/ui/cliente/weatherHook';
import { RecomendadosTable } from '@/app/ui/cliente/recomendadosTable';
import { WeatherAnimationSkeleton, SkeletonTitulo } from '@/app/ui/skeletons';
import { satisfy } from '@/app/ui/fonts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { subscribeToTopic, unsubscribeFromTopic, checkSubscription } from '@/app/lib/actions';
import { getPermissionAndToken } from '@/app/lib/notifications';
import ChatBox from '@/app/ui/cliente/chatbox';

export default function Page() {
  const { claveClima } = useWeather();
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica estado de suscripción a notificaciones al montar el componente
  useEffect(() => {
    const verifySubscription = async () => {
      setLoading(true);
      try {
        const token = await getPermissionAndToken();
        if (!token) {
          setError('No se otorgaron permisos de notificación');
          setSubscribed(false);
          return;
        }

        const { isSubscribed } = await checkSubscription(token);
        setSubscribed(isSubscribed);
        setError(null);
      } catch (error) {
        console.error('Error verificando suscripción:', error);
        setError('Error verificando suscripción');
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  // Función para suscribirse al topic 'ofertas'
  const handleSubscribe = async () => {
    try {
      const token = await getPermissionAndToken();
      if (!token) throw new Error('No hay token para suscribirse');

      const res = await subscribeToTopic([token], 'ofertas');
      if (!res.success) throw new Error('Error en la suscripción');

      setSubscribed(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error en la suscripción');
    }
  };

  // Función para desuscribirse del topic 'ofertas'
  const handleUnsubscribe = async () => {
    try {
      const token = await getPermissionAndToken();
      if (!token) throw new Error('No hay token para desuscribirse');

      const res = await unsubscribeFromTopic(token);
      if (!res.success) throw new Error('Error al desuscribirse');
      localStorage.removeItem('fcmToken');
      setSubscribed(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al desuscribirse');
    }
  };

  return (
    <div className="w-full min-h-full px-4 md:px-8 py-6 space-y-10">
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-end"
        >
          {claveClima === "" ? (
            <WeatherAnimationSkeleton />
          ) : (
            <AnimatedWeather claveClima={claveClima} />
          )}
        </motion.div>
      </div>

      <div className="space-y-6">
        {claveClima ? (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`${satisfy.className} text-3xl text-carbon text-center`}
          >
            Recomendaciones del día
          </motion.h2>
        ) : (
          <div className='flex justify-center items-center'>
            <SkeletonTitulo />
          </div>
        )}
        <RecomendadosTable claveClima={claveClima} />
      </div>

      <div><ChatBox /></div>

      <div className="text-center mt-6 space-y-2" aria-busy={loading}>
        {subscribed ? (
          <button
            onClick={handleUnsubscribe}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
            disabled={loading}
            aria-label="Cancelar suscripción a notificaciones de ofertas"
          >
            {loading ? 'Cargando...' : 'Desuscribirse'}
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            className="bg-greenMateButton hover:opacity-80 text-white px-4 py-2 rounded-xl transition"
            disabled={loading}
            aria-label="Suscribirse a notificaciones de ofertas"
          >
            {loading ? 'Cargando...' : 'Suscribirse a notificaciones'}
          </button>
        )}
        {error && (
          <p className="text-red-600 text-sm" role="alert">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}
