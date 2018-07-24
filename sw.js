
const staticCacheName = 'restaurant-review-v132';


self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        'index.html',
        'restaurant.html',
        'manifest.json',
        'js/dbhelper.js',
        'js/idb_main.js',
        'js/idb_restaurant_info.js',
        'js/idb.js',
        'js/main.js',
        'js/rating.js',
        'js/restaurant_info.js',
        // 'sw.js', // The service worker itself musn't be cached
        'css/styles.css',
        'img/1_350.jpg',
        'img/1_700.jpg',
        'img/1_800.jpg',
        'img/2_350.jpg',
        'img/2_700.jpg',
        'img/2_800.jpg',
        'img/3_350.jpg',
        'img/3_700.jpg',
        'img/3_800.jpg',
        'img/4_350.jpg',
        'img/4_700.jpg',
        'img/4_800.jpg',
        'img/5_350.jpg',
        'img/5_700.jpg',
        'img/5_800.jpg',
        'img/6_350.jpg',
        'img/6_700.jpg',
        'img/6_800.jpg',
        'img/7_350.jpg',
        'img/7_700.jpg',
        'img/7_800.jpg',
        'img/8_350.jpg',
        'img/8_700.jpg',
        'img/8_800.jpg',
        'img/9_350.jpg',
        'img/9_700.jpg',
        'img/9_800.jpg',
        'img/10_350.jpg',
        'img/10_700.jpg',
        'img/10_800.jpg',
        'img/nia_350.jpg',
        'img/nia_700.jpg',
        'img/nia_800.jpg'
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


// event listener of the backgroun syn. When the conection is ready, send a message to the clients:
self.addEventListener('sync', function (event) {
  // console.log("inside sync")
  if (event.tag === 'review-submission') {
    event.waitUntil(postMessageToClients(event.tag));
  }
});
