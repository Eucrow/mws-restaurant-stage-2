let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Register the service worker
 */
// if (navigator.serviceWorker){
//   navigator.serviceWorker.register('sw.js').then(function(){
//     console.log('Registration worked!');
//     }).catch(function(){
//     console.log('Registration failed!');
//   });
// }

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  // console.log(restaurants);
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.setAttribute('aria-label', `List of restaurants`)
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const picture = document.createElement('picture');
  // picture.className = 'restaurant-img';
  imageSrc = DBHelper.imageUrlForRestaurant(restaurant)
  imageExtension = imageSrc.slice((imageSrc.lastIndexOf(".") - 1 >>> 0) + 2);
  imagePathWhitoutExtension = imageSrc.slice(0, imageSrc.lastIndexOf("."));
  
  // small image
  let source = document.createElement('source');
  source.className = 'restaurant-img';
  source.media = "(max-width:350px)";
  source.srcset = imagePathWhitoutExtension + "_350." + imageExtension;
  source.type = "image/jpeg"
  picture.appendChild(source)
  // medium image
  source = document.createElement('source');
  source.className = 'restaurant-img';
  source.media = "(min-width:351px, max-width:700px)";
  source.srcset = imagePathWhitoutExtension + "_700." + imageExtension;
  source.type = "image/jpeg"
  picture.appendChild(source)
  // default image (the biggest one)
  const img = document.createElement('img');
  img.className = 'restaurant-img';
  img.src = imagePathWhitoutExtension + "_800." + imageExtension;
  img.alt = `Image of ${restaurant.name} restaurant`;
  picture.appendChild(img);
  li.append(picture);
 

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.setAttribute('aria-label', `Restaurant ${restaurant.name}`)
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('address');
  address.setAttribute('aria-label', `Adress of ${restaurant.name}`)
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.setAttribute('aria-label', `View detailsss of restaurant ${restaurant.name}`);
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
