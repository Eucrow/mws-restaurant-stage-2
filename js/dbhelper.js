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
  static fetchRestaurants(callback) {

    var dbPromise = idb.open('restaurantDB');

    dbPromise.then(function(db) {
      var tx = db.transaction('restaurants', 'readonly');
      var store = tx.objectStore('restaurants');
      return store.getAll();
    }).then(restaurants => callback(null, restaurants));
    
  }

  /**
   * Fetch all reviews from server
   */
  static fetchReviewsFromServer(callback){
    fetch(`${DBHelper.DATABASE_URL}/reviews`)
    .then(response => response.json())
    .then(restaurants => callback(null, restaurants));
  }

  /**
   * Fetch all reviews of a restaurant from server.
   */
  static fetchReviewsByRestaurantFromServer(restaurantId){
    return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${restaurantId}`)
      .then(response => response.json())
  }

  static fetchReviewsFromIDB(){
    return dbPendingPromise.then(function(db){
      var tx = db.transaction('reviews', 'readonly');
      var store = tx.objectStore('reviews');
      return store.getAll();
    })
  }
/**
 * Fetch reviews saved in reviews IDB database and pending reviews IDB database
 */
  // static fetchReviewsOffline(){
  //   const fromOnline = this.fetchReviewsFromIDB();
  //   console.log (fromOnline);
  //   const fromOffline = this.fetchPendingReviewsFromIDB();
  //   console.log (fromOffline);
  //   const reviews = fromOnline + fromOffline;
  //   return reviews;
  // }

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
   * Save review to pendingReviewsDB
   */
  static savePendingReview(review){
    return dbPendingPromise.then(function(db){
      var tx = db.transaction('pendingReviews', 'readwrite');
      var store = tx.objectStore('pendingReviews');
      store.add(review);
    })
  }

  // static fetchReviewsByRestaurantOffline(restaurantId){
  //   return this.fetchReviewsOffline()
  //     .then(revs => revs.json());
    
  // }

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
  }
  
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    DBHelper.fetchRestaurants((error, restaurants) => {
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
    // so I put .jpg
    if(restaurant.photograph) {
     return (`/img/${restaurant.photograph}.jpg`);
    } else { // If there aren't any image to the restaurant, put the default image.
      return (`/img/nia.jpg`)
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
  static fetchRestaurantFromIDB(restaurant){
    var dbPromise = idb.open('restaurantDB');
    return dbPromise
    .then ( db => {
      var tx = db.transaction('restaurants', 'readonly');
      var store = tx.objectStore('restaurants');
      var rest = store.get(restaurant.id)
        .then(rest => {
            console.log(rest.id);
            return(rest)
          });
      return rest;
    })
  }

  static isFavorite(restaurant){
    DBHelper.fetchRestaurantFromIDB(restaurant)
    .then(rest =>  {
      return (rest.is_favorite);
    })
  }

  static toggleFavoriteFromLocal(restaurant){
    const rest = DBHelper.fetchRestaurantFromIDB(restaurant);
    console.log(restaurant.is_favorite)
    // change the value of is_favorite variable
    restaurant.is_favorite = !restaurant.is_favorite;
    // change the value of updatedIsFavorite, to mark a restaurant which has been its
    // variable is_favorite changed
    restaurant.updatedIsFavorite = !restaurant.updatedIsFavorite;
    console.log(restaurant.is_favorite)
    debugger

    var dbPromise = idb.open('restaurantDB');
    return dbPromise
      .then ( db => {
        var tx = db.transaction('restaurants', 'readwrite');
        var store = tx.objectStore('restaurants');
        store.put(restaurant);
      })
    }

}