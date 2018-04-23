function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-final-1';
var filesToCache = [
  '/',
  '/index.html',
  '/confirm.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/styles/custom.css',
  '/images/movies/13 Hours: The Secret Soldiers of Benghazi',
  '/images/movies/Geostorm',
  '/images/movies/In the Heart of the Sea',
  '/images/movies/The Forest',
  '/images/movies/The Jungle Book',
  '/images/movies/The Secret Life of Pets',
  '/images/movies/Victor Frankenstein',
  '/images/movies/Angry Birds',
  '/images/movies/Ben-Hur',
  '/images/movies/Deadpool',
  '/images/movies/Dirty Grandpa',
  '/images/movies/Finding Dory',
  '/images/movies/Hail, Caesar!',
  '/images/movies/The 5th Wave',
  '/images/movies/Lamb',
  '/images/movies/Anesthesia',
  '/images/movies/Snowden',
  '/images/movies/The Good Dinosaur',
  '/images/movies/The Peanuts Movie',
  '/images/movies/Crimson Peak',
  '/images/icons/icon.png',
  '/images/icons/badge.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
 
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://college-movies.herokuapp.com/';
  if (e.request.url.indexOf(dataUrl) > -1) {
   
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
  
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener('push', function(event) {
  const title = 'Push Notify!';
  const options = {
    body: event.data.text(),
    icon: 'images/icons/icon.png',
    badge: 'images/icons/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


