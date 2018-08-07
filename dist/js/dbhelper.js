/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    // the old configuration:
    // const port = 8000 // Change this to your server port
    // return `http://localhost:${port}/data/restaurants.json`;

    const port = 1337 // Change this to your server port
    return `http://localhost:${port}`;

  }

  /**
   * Fetch restaurants: first try it in local database (for the first time the page is loaded)
   * and then try to fetch from the network
   * @param {} callback 
   */
  static fetchRestaurants(callback) {

    DBHelper.fetchRestaurantsFromIDB((error, data) => {
    
      if (data && data.length){
        callback(null, data);
      } else {
        DBHelper.fetchRestaurantsFromServer( (error, data) => {
          if (error) {
            console.log (error);
            return;
          }
          // console.log(data)
          callback(null, data)
        });
      }
    })
  }


  /**
   * Fetch all restaurants from server.
   */
  static fetchRestaurantsFromServer(callback) {
    fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then(response => response.json())
      // .then(response => console.dir(response))
      .then(restaurants => callback(null, restaurants));
  }

  /**
   * Fetch all restaurants from idb
   */
  static fetchRestaurantsFromIDB(callback) {

    var dbPromise = idb.open('restaurantDB');

    dbPromise.then(function(db) {
      var tx = db.transaction('restaurants', 'readonly');
      var store = tx.objectStore('restaurants');
      return store.getAll();
    }).then(restaurants => callback(null, restaurants));
    
  }
  /**
   * Fetch reviews: first try it in local database (for the first time the page is loaded)
   * and then try to fetch from the network
   * @param {} callback 
   */
  static fetchReviews(callback){
    DBHelper.fetchReviewsFromIDB()
    .then(data => {
      if (data && data.length) {
        callback(null, data)
      } else {
        this.fetchReviewsFromServer((error, data) => {
          
          if(error) {
            console.log(error);
            return;
          }
          callback(null, data)
        })
      }
    })
  }
  /**
   * Fetch all reviews from server
   */
  static fetchReviewsFromServer(callback){
    fetch(`${DBHelper.DATABASE_URL}/reviews`)
    .then(response => response.json())
    .then(restaurants => callback(null, restaurants));
  }
  
  static fetchReviewsFromIDB(){
    return dbPromiseReview.then(function(db){
      var tx = db.transaction('reviews', 'readonly');
      var store = tx.objectStore('reviews');
      return store.getAll();
    })
  }
  
  /**
   * Fetch all reviews of a restaurant from server.
   */
  static fetchReviewsByRestaurantFromServer(restaurantId){
    return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${restaurantId}`)
      .then(response => response.json())
  }

  /**
   * Fetch all reviews of a restaurant from local.
   */
  static fetchReviewsByRestaurantFromIDB(restaurantId){
    return DBHelper.fetchReviewsFromIDB()
    .then(reviews => reviews.filter(review => review.restaurant_id == restaurantId))
    .then(reviews => {
      console.log(reviews)
      return (reviews)
    })
  }

  static fetchReviewsByRestaurantID(restaurantId, callback){

    DBHelper.fetchReviews((error, data) => {
      if (error){
        callback(error, null);
      }
      const reviews = data.filter(review => review.restaurant_id == restaurantId)
      callback(null, reviews);
    })
    
  }

  /**
   * Fetch all pending reviews from pendingReviewsDB
   */
  static fetchPendingReviewsFromIDB(){
    return dbPendingPromise.then(function(db){
      var tx = db.transaction('pendingReviews', 'readonly');
      var store = tx.objectStore('pendingReviews');
      return store.getAll();
    })
  }

  /**
   * Remove all data in pendingReviewsDB
   */
  static clearPendingReviewsIDB(){
    return dbPendingPromise.then(function(db){
      var tx = db.transaction('pendingReviews', 'readwrite');
      var store = tx.objectStore('pendingReviews');
      store.clear().onsuccess = function(event){
        return("Pending reviews database clear!");
      };
    })
  }

  /**
   * Save pending review to local pendingReviewsDB
   */
  static savePendingReviewToPengingReviewsDB(review){
    return dbPendingPromise.then(function(db){
      var tx = db.transaction('pendingReviews', 'readwrite');
      var store = tx.objectStore('pendingReviews');
      store.add(review);
    })
  }

    /**
   * Save review to local ReviewsDB
   */
  static saveReviewToReviewsDB(review){
    return dbPromiseReview.then(function(db){
      var tx = db.transaction('reviews', 'readwrite');
      var store = tx.objectStore('reviews');
      store.add(review);
    })
  }

  /**
   * Save review to Server
   */
  static saveReviewToServer(review){
    // this function can receive a formData or a javascript object. Fetch can't work with js object:
    if (!(review instanceof FormData)){
      review = JSON.stringify(review);
    }
    return fetch(`${DBHelper.DATABASE_URL}/reviews`, {
      method: 'POST',
      body: review
    })
    .catch(error => (console.log (error)))
  }
  
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    // DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    // DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    // in this version of database, the name of the photograph doesn't have extension,
    // so I put .webp
    if(restaurant.photograph) {
     return (`/img/${restaurant.photograph}.webp`);
    } else { // If there aren't any image to the restaurant, put the default image.
      return (`/img/nia.webp`)
    }
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }
  
  /**
   * FAVORITES!!
   */

  /**
  * Get all the restaurants pending of save in server (they have the variable updatedIsFavorite equal
  * to true)
  */
  static getPendingFavoritesFromIDB(callback){
    DBHelper.fetchRestaurantsFromIDB((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const modifiedFavorites = restaurants.filter( rest => rest.updatedIsFavorite == true );
        callback (null, modifiedFavorites);
        // return (modifiedFavorites);
      }
    })
  }

  /**
   * Toggle the variable pendingToUpdateFavorite or a restaurant
   * @param {*} restaurant 
   */
  static togglePendingToUpdateFavoriteInLocal(restaurant){

    restaurant.updatedIsFavorite = !restaurant.updatedIsFavorite;

    var dbPromise = idb.open('restaurantDB');
    return dbPromise.then ( db => {
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      return (store.put(restaurant));

    })

  }

    /**
   * Toggle the variable pendingToUpdateFavorite or a restaurant
   * @param {*} restaurant 
   */
  static setPendingToUpdateFavoriteInLocal(restaurant, value){

    restaurant.updatedIsFavorite = value;

    var dbPromise = idb.open('restaurantDB');
    return dbPromise.then ( db => {
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      return (store.put(restaurant));

    })

  }

  /**
   * Sumbit the pending restaurants which had been modified and marked with the
   * pendingToUpdateFavorite variable
   */
  static sumbitPendingFavorites () {
      // when the is-favorite-submission message is received:
      // - get the restaurants which have pendingToUpdateFavorite variable to true
      // - upload it to online server
      // - set the pendingToUpdateFavorite variable to false
    DBHelper.getPendingFavoritesFromIDB((err, pendingFavorites) => {
      
      pendingFavorites.forEach(restaurant => {
        DBHelper.updateFavoriteInServer(restaurant, (error, fav) => {
          if (error) {
            console.log (error);
            return;
          }
        })
        
        // DBHelper.togglePendingToUpdateFavoriteInLocal(restaurant);
        DBHelper.setPendingToUpdateFavoriteInLocal(restaurant, false);
        
      })

    })
  }
  
  /**
   * toggle is_favorite variable in local database
   * @param {*} restaurant 
   */
  static toggleFavoriteInLocal(restaurant){

    // change the value of is_favorite variable
    restaurant.is_favorite = !restaurant.is_favorite;

    var dbPromise = idb.open('restaurantDB');
    return dbPromise.then ( db => {
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      var storeUpdated = store.put(restaurant);
      return storeUpdated;
    })
    .catch(error => console.log(error));

  }

  /**
   * Update is_favorite in server
   * @param {*} restaurant 
   * @param {*} callback 
   */
  static updateFavoriteInServer(restaurant, callback){
    // console.log(restaurant);
    fetch(`${DBHelper.DATABASE_URL}/restaurants/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`,
      {method: "PUT"})
      .then(response => {return (response.json())})
      .then(rest => { callback (null, rest) })
      .catch(error => {
        callback (error, null)
      });
  }

  /**
   * Toggle favorite in local and in server
   * 
   * @param {*} restaurant 
   */
  static toggleFavorite (restaurant) {
    
    DBHelper.toggleFavoriteInLocal(restaurant);
    
    DBHelper.updateFavoriteInServer(restaurant, (error, rest) => {
      
      if (error) {
                // if there are any error:
                // is_favorite in local is already saved, so we have to 
                // toggle variable pendingToUpdateFavorite in local
                console.log(error)
                // DBHelper.togglePendingToUpdateFavoriteInLocal(restaurant);
                DBHelper.setPendingToUpdateFavoriteInLocal(restaurant, true)

                // register the background sync
                navigator.serviceWorker.ready.then(function(reg) {
                    reg.sync.register('is-favorite-submission');
                    // console.log ('is_favorite sync registered!!')
                });

                console.log (error);
                return;
            }
      

      })

  }

}