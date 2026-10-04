// Garage Music Bar — shared service worker for all staff interfaces.
// Handles Web Push when the screen is off / the app is closed.

let lastAppUrl = '/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if(data.type === 'app_url' && typeof data.url === 'string' && data.url){
    lastAppUrl = data.url;
  }
});

self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let data = { title: 'Garage Music Bar', body: 'Новое уведомление', url: lastAppUrl };
  try { if (event.data) data = event.data.json(); } catch (e) {}

  const url = data.url || lastAppUrl || '/';
  const options = {
    body: data.body || 'Новое уведомление',
    tag: data.tag || ('garage-notify-' + Date.now()),
    renotify: true,
    vibrate: [200, 100, 200],
    requireInteraction: false,
    icon: '/icons/icon-waiter-192.png',
    badge: '/icons/icon-waiter-192.png',
    data: { url },
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Garage Music Bar', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const raw = (event.notification.data && event.notification.data.url) || lastAppUrl || '/';
  const targetUrl = new URL(raw, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          if ('navigate' in client) {
            try { client.navigate(targetUrl); } catch (e) {}
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      client.postMessage({ type: 'push_subscription_changed' });
    }
  })());
});
