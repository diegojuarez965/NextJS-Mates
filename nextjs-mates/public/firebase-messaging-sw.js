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

// Nombres de cachés
const CACHE_VERSION = 'v1';
const CACHES_NAMES = {
    images: `images-cache-${CACHE_VERSION}`,
    assets: `assets-cache-${CACHE_VERSION}`,
    fonts: `fonts-cache-${CACHE_VERSION}`,
    pages: `pages-cache-${CACHE_VERSION}`,
    api: `api-cache-${CACHE_VERSION}`,
    misc: `misc-cache-${CACHE_VERSION}`
};

// Límite de elementos en caché
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        await limitCacheSize(cacheName, maxItems);
    }
}

// Limpiar cachés viejos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => !Object.values(CACHES_NAMES).includes(key))
                    .map(key => caches.delete(key))
            )
        )
    );
});

// Interceptar requests
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    // 1️⃣ Cache First - Imágenes
    if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
        event.respondWith(
            caches.open(CACHES_NAMES.images).then(cache =>
                cache.match(request).then(cachedResponse => {
                    if (cachedResponse) return cachedResponse;
                    return fetch(request).then(networkResponse => {
                        cache.put(request, networkResponse.clone());
                        limitCacheSize(CACHES_NAMES.images, 50);
                        return networkResponse;
                    });
                })
            )
        );
        return;
    }

    // 2️⃣ Cache First - CSS & JS
    if (url.pathname.match(/\.(css|js)$/)) {
        event.respondWith(
            caches.open(CACHES_NAMES.assets).then(cache =>
                cache.match(request).then(cachedResponse => {
                    return cachedResponse || fetch(request).then(networkResponse => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            )
        );
        return;
    }

    // 3️⃣ Cache First - Fuentes
    if (url.pathname.match(/\.(woff2?|ttf|otf|eot)$/)) {
        event.respondWith(
            caches.open(CACHES_NAMES.fonts).then(cache =>
                cache.match(request).then(cachedResponse => {
                    return cachedResponse || fetch(request).then(networkResponse => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            )
        );
        return;
    }

    // 4️⃣ Network First - API
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).then(networkResponse => {
                const clone = networkResponse.clone();
                caches.open(CACHES_NAMES.api).then(cache => cache.put(request, clone));
                return networkResponse;
            }).catch(() => caches.match(request))
        );
        return;
    }

    // 5️⃣ Network First - Páginas HTML
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request).then(networkResponse => {
                const clone = networkResponse.clone();
                caches.open(CACHES_NAMES.pages).then(cache => cache.put(request, clone));
                return networkResponse;
            }).catch(() => caches.match(request))
        );
        return;
    }

    // 6️⃣ Cache First - Otros (manifest, favicon)
    if (url.pathname.match(/(manifest\.json|favicon\.ico)$/)) {
        event.respondWith(
            caches.open(CACHES_NAMES.misc).then(cache =>
                cache.match(request).then(cachedResponse => {
                    return cachedResponse || fetch(request).then(networkResponse => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            )
        );
        return;
    }
});

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] 📥 Background Message recibido:', payload);

    const notificationTitle = payload.data?.title || 'Título por defecto';
    const notificationOptions = {
        body: payload.data?.body || 'Cuerpo por defecto',
        icon: '/icons/icon-192x192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});