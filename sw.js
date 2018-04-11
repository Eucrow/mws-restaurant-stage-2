const staticCacheName = 'restaurant-review-v16';

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        '/', // Important include the root.. Why?? I dont know
        '/index.html',
        '/restaurant.html',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/css/styles.css',
        '/data/restaurants.json'
      ]);
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName.startsWith('restaurant-review-v') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName){
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if (response){
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      // console.log('NOT FOUND ', event.request.url, ' in cache');
      return fetch(event.request);
    }));
  
});

// self.addEventListener('fetch', function(event){
//   console.log("kkk");
//   // event.respondWith(
//   //   new Response('Hello <b> world </b>'), {
//   //     headers: {'Content-Type': 'text/html'}
//   //   }
//   // )
// });
