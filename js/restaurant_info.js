let restaurant;
var map;

/**
 * Register the service worker
 */

if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(registration => navigator.serviceWorker.ready)
    .then(() => {
      // console.log('Registration worked!!');
    });
}

// if (navigator.serviceWorker){
//   navigator.serviceWorker.register('sw.js').then(function(){
//     console.log('Registration worked!');
//     }).catch(function(){
//     console.log('Registration failed!');
//   });
// }

// Event to reload the reviews section:
const reload_reviews_event = new Event("reload_reviews_event");

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}


/**
 * Create picture HTML and add it to the webpage
 */
fillPictureRestaurant = (restaurant = self.restaurant) =>{
  const picture = document.getElementById('restaurant-img');
  picture.className = 'restaurant-img';

  imageSrc = DBHelper.imageUrlForRestaurant(restaurant)
    imageExtension = imageSrc.slice((imageSrc.lastIndexOf(".") - 1 >>> 0) + 2);
    imagePathWhitoutExtension = imageSrc.slice(0, imageSrc.lastIndexOf(".")) 
    // small image
    let source = document.createElement('source');
    source.className = 'restaurant-img';
    source.media = "(max-width:350px)";
    source.srcset = imagePathWhitoutExtension + "_350." + imageExtension;
    source.type = "image/jpeg";
    picture.appendChild(source)
    // medium image
    source = document.createElement('source');
    source.className = 'restaurant-img';
    source.media = "(min-width:351px, max-width:700px)";
    source.srcset = imagePathWhitoutExtension + "_700." + imageExtension;
    source.type = "image/jpeg";
    picture.appendChild(source)
    // default image (the biggest one)
    const img = document.createElement('img');
    img.className = 'restaurant-img';
    img.src = imagePathWhitoutExtension + "_800." + imageExtension;
    img.alt = `Image of ${restaurant.name} restaurant`;
    picture.appendChild(img);
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  // fill picture
  fillPictureRestaurant();

  // fill cuisine
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill favorite
  fillFavorite();
  
  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }

  // reviews
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  // fill form to add review
  fillFormReview(restaurant.id);

  // fill all reviews
  fillReviews();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');

  const caption = document.createElement('caption');
  caption.innerHTML = 'Operating hours:';
  hours.appendChild(caption);

  const tableTitlesRow = document.createElement('tr')

  const tableTitleDay = document.createElement('th');
  tableTitleDay.setAttribute('scope', 'col');
  tableTitleDay.innerHTML = 'Day';
  tableTitlesRow.appendChild(tableTitleDay);

  const tableTitleHours = document.createElement('th');
  tableTitleHours.innerHTML = 'Hours';
  tableTitlesRow.appendChild(tableTitleHours);
  
  hours.appendChild(tableTitlesRow);

  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviews = () => {
  // console.log ('inside fillReviews')
  DBHelper.fetchReviewsByRestaurantFromIDB(self.restaurant.id)
  // DBHelper.fetchReviewsByRestaurantFromServer(self.restaurant.id)
    .then(reviews => fillReviewsHTML(reviews))
    .catch((err) => {
      console.log(err);
     });
}

addPendingReviewToHTML = (review) => {
  const reviewsList = document.getElementById('reviews-list')
  const newReview = createReviewHTML(review);

  reviewsList.appendChild(newReview);
}

fillReviewsHTML = (reviews) => {
  // debugger
  // console.log('inside fillReviewsHTML');
  const container = document.getElementById('reviews-container');
  /* when a review is published, the reviews-list must be updated, so: */
  if (document.getElementById('reviews-list')) {
    document.getElementById('reviews-list').innerHTML = "";
  } else {
    const reviewsList = document.createElement('reviews-list');
    reviewsList.setAttribute('id','reviews-list');
    reviewsList.classList.add('reviews-list');
    container.appendChild(reviewsList);
  }

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    // debugger
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.classList.add('review-wraper');

  const header = document.createElement('div');
  header.classList.add('review-header');
  li.appendChild(header);

  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.classList.add('review-name');
  header.appendChild(name);

  const date = document.createElement('p');
  dateString = new Date(review.createdAt);
  date.innerHTML = dateString.toLocaleString();
  date.classList.add('review-date');
  header.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.classList.add('review-rating');
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.classList.add('review-comments');
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
