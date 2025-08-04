import { useEffect, useState } from "react";
import { clasificarClima } from "../../lib/weather-utils";
import { getMensajeClimaDesdeCoords } from "../../lib/data";

export function useWeather() {
  const [claveClima, setClaveClima] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback si el navegador no soporta geolocalización
    if (!navigator.geolocation) {
      console.log("Geolocalización no soportada");
      setClaveClima('No se pudo obtener el clima');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // Fetch del clima basado en coordenadas
          const mensaje = await getMensajeClimaDesdeCoords(coords.latitude, coords.longitude);
          const clave = clasificarClima(
            mensaje.current.apparent_temperature,
            mensaje.current.is_day,
            mensaje.current.cloud_cover
          );
          console.log("✅ Clima detectado:", clave);
          setClaveClima(clave);
        } catch (error) {
          console.error(error);
          setClaveClima('No se pudo obtener el clima');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        // Error al obtener coordenadas
        console.log("❌ Error de geolocalización:", error);
        setClaveClima('No se pudo obtener el clima');
        setLoading(false);
      }
    );
  }, []);

  return { claveClima, loading };
}