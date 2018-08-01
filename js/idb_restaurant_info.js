if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
  }

var dbPromise = idb.open('reviewsDB', 3, function(upgradeDb){
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
            // create variable pendingToUpdateFavorite to use when there are any problems
            // with the conection
            rest.pendingToUpdateFavorite = false;
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
