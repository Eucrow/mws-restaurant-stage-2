
if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
  }


var dbPromise = idb.open('restaurantDB', 7, function(upgradeDb){
    if (!upgradeDb.objectStoreNames.contains('restaurants')){
        var restaurantStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
        });
    }
});

  
dbPromise.then(db => {
    DBHelper.fetchRestaurantsFromServer((error, restaurants) => {
        restaurants.forEach(function(rest){
            var tx = db.transaction('restaurants', 'readwrite');
            var keyValStore = tx.objectStore('restaurants');
            keyValStore.put(rest);
        })
    })
});

// dbPromise.then(function(db){
//     var tx = db.transaction('keyval'); // create a transaction
//     var keyValStore = tx.objectStore('keyval'); // call the object store I want. This is possible to have a transaction that uses multiple object stores
//     return keyValStore.get('hello');
// }).then(function(val){
//     console.log(`The value of hello is ${val}`);
// })

// dbPromise.then(function(db){
//     var tx = db.transaction('keyval', 'readwrite');
//     var keyValStore = tx.objectStore('keyval');
//     keyValStore.put('bar', 'foo');
//     return tx.complete;
// }).then(function(){
//     console.log('Added foo:bar to keyval');
// })