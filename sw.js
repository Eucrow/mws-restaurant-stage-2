const staticCacheName = 'restaurant-review-v16';

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        'index.html',
        'restaurant.html',
        'sw.js',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'data/restaurants.json',
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
        'img/10_800.jpg'
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
  
    caches.match(event.request, {ignoreSearch:true}).then(function(response){
      if (response){
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      return fetch(event.request);
    })
  );
  
});
