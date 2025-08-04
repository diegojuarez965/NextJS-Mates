
export function registerServiceWorker() {
  console.log('Intentando registrar service worker...');
  // Verifica si el navegador soporta Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      // Intenta registrar el Service Worker en la ruta especificada
      .register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('Service Worker registrado con scope:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar Service Worker:', error);
      });
  } else {
    console.log('Service Worker no soportado en este navegador.');
  }
}
