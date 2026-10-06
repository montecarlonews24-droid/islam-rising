/* ════════════════════════════════════════════════
   Islam Rising — Service Worker
   يخزّن الملفات محلياً للعمل Offline
════════════════════════════════════════════════ */

const CACHE_NAME = 'islam-rising-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './App.jsx',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // CDN (React + Babel) — يُخزَّن عند أول تحميل
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Noto+Naskh+Arabic:wght@400;600;700;900&display=swap',
];

/* ── Install: cache all static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/* ── Activate: delete old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch ──
   صفحات HTML (الصفحة الرئيسية وكل صفحات التطبيق): شبكة أولاً، والكاش
   احتياط للأوفلاين فقط — هيك أي تحديث نرفعه يوصل فورًا أول ما يكون
   فيه إنترنت، بدل ما يضل عالق على نسخة قديمة بالكاش.
   باقي الملفات (أيقونات، خطوط، مكتبات CDN): تبقى كاش أولاً زي ما كانت،
   لأنها نادرًا ما تتغيّر وهيك أسرع وبيشتغل أوفلاين. */
self.addEventListener('fetch', event => {
  // Skip non-GET and API calls
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('api.anthropic.com')) return;
  if (event.request.url.includes('storage')) return;

  const isAppPage = event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    event.request.url.endsWith('.html') ||
    event.request.url.endsWith('.jsx');

  if (isAppPage) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Cache valid responses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
    })
  );
});

/* ── Push Notifications ── */
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || '🕌 Islam Rising', {
      body: data.body || 'حان وقت الصلاة',
      icon: './icons/icon-192.png',
      badge: './icons/icon-96.png',
      tag: data.tag || 'prayer',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: data.url || './' },
    })
  );
});

/* ── Notification Click ── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('islam-rising') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('./');
    })
  );
});
