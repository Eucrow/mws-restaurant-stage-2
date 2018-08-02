const staticCacheName = 'restaurant-review-v190';

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        // 'sw.js', // The service worker itself musn't be cached
        'index.html',
        'restaurant.html',
        'manifest.json',
        // dist
        'dist/js/db.js',
        'dist/js/main.js',
        'dist/js/restaurant.js',
        // end of dist
        // develop
        // 'js/dbhelper.js',
        // 'js/favorites.js',
        // 'js/idb_main.js',
        // 'js/idb_restaurant_info.js',
        // 'js/idb.js',
        // 'js/main.js',
        // 'js/rating_stars.js',
        // 'js/onload_restaurant.js',
        // 'js/restaurant_info.js',
        // end of develop
        'css/styles.css',
        'img/1_350.webp',
        'img/1_700.webp',
        'img/1_800.webp',
        'img/2_350.webp',
        'img/2_700.webp',
        'img/2_800.webp',
        'img/3_350.webp',
        'img/3_700.webp',
        'img/3_800.webp',
        'img/4_350.webp',
        'img/4_700.webp',
        'img/4_800.webp',
        'img/5_350.webp',
        'img/5_700.webp',
        'img/5_800.webp',
        'img/6_350.webp',
        'img/6_700.webp',
        'img/6_800.webp',
        'img/7_350.webp',
        'img/7_700.webp',
        'img/7_800.webp',
        'img/8_350.webp',
        'img/8_700.webp',
        'img/8_800.webp',
        'img/9_350.webp',
        'img/9_700.webp',
        'img/9_800.webp',
        'img/10_350.webp',
        'img/10_700.webp',
        'img/10_800.webp',
        'img/nia_350.webp',
        'img/nia_700.webp',
        'img/nia_800.webp',
        'img/heart_highlight.svg',
        'img/heart_normal.svg',
        'img/star_highlight.svg',
        'img/star_normal.svg'
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

  const url = new URL(event.request.url);
  
  if (url.pathname.startsWith('/restaurant.html')) {
        event.respondWith(
            caches.match('restaurant.html').then(response => response || fetch(event.request))
        );
        return;
  } else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }

  // I think this work in the same way:
  // event.respondWith(
  
  //   caches.match(event.request, {ignoreSearch:true}).then(function(response){
  //     if (response){
  //       console.log('Found ', event.request.url, ' in cache');
  //       return response;
  //     }
  //     return fetch(event.request);
  //   })
  // );
  

});

// funtcion to send a message to the clients
function postMessageToClients(message) {
  return clients.matchAll().then(allClients => {
    for (const client of allClients) {
      client.postMessage(message);
    }
  })
};


// event listener of the background sync. When the conection is ready, send a message to the clients:
self.addEventListener('sync', function (event) {
  // console.log("inside sync")
  if (event.tag === 'review-submission') {
    event.waitUntil(postMessageToClients(event.tag));
  }

  if (event.tag === 'is-favorite-submission') {
    // console.log ( "inside sync listener: " + event.tag);
    event.waitUntil(postMessageToClients(event.tag));
  }

});
