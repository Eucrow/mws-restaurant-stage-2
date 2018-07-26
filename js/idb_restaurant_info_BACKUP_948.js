if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
  }

var dbPromise = idb.open('reviewsDB', 2, function(upgradeDb){
    if (!upgradeDb.objectStoreNames.contains('reviews')){
        var reviewsStore = upgradeDb.createObjectStore('reviews', {
            keyPath: 'id'
        })
    }
});

dbPromise.then(db => {
    DBHelper.fetchReviewsFromServer((error, reviews) => {
        reviews.forEach(function(rest){
            var tx = db.transaction('reviews', 'readwrite');
            var keyValStore = tx.objectStore('reviews');
            keyValStore.put(rest);
        })
    })
})

var dbPendingPromise = idb.open('pendingReviewsDB', 1, function(upgradeDB){
    if (!upgradeDB.objectStoreNames.contains('pendingReviews')){
        var pendingReviewsStore = upgradeDB.createObjectStore('pendingReviews', {
            autoIncrement:true
        });
    }
})
