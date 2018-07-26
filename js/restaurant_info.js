let restaurant;
var map;

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
  // const name = document.getElementById('restaurant-name');
  // name.innerHTML = restaurant.name;

  // const address = document.getElementById('restaurant-address');
  // address.innerHTML = restaurant.address;

  // fill picture
  // fillPictureRestaurant();

  // const cuisine = document.getElementById('restaurant-cuisine');
  // cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  // if (restaurant.operating_hours) {
  //   fillRestaurantHoursHTML();
  // }

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

  // /**
  //  * remove the higlight in all the elements (stars) of rating
  //  */
  // unlightRating = (e) => {
  //   for(var r=0; r<e.length; r++){
  //     // e[r].classList.remove('rating-radio_highlight');
  //     e[r].setAttribute('src', '../img/star_normal.svg');
  //   }
  // }

  // /**
  //  * Higlight an element (star) of the rating
  //  */
  // higlightRating = (e) => {
  //   const elem = document.getElementById(e);
  //   // elem.classList.add('rating-radio_highlight');
  //   // debugger;
  //   elem.setAttribute('src', '../img/star_highlight.svg');
  // }


  // fillFormReview = (restaurant_id) => {

  //   const formReview = document.getElementById('form-review');

  //   const titleFormReview = document.createElement("h3");
  //   titleFormReview.innerHTML = "Send your own review:";
  //   titleFormReview.setAttribute('id', 'title-form-review');
  //   formReview.appendChild(titleFormReview);

  //   const restaurantId = document.createElement("input");
  //   restaurantId.setAttribute('type', 'hidden');
  //   restaurantId.setAttribute('value', restaurant_id);
  //   restaurantId.setAttribute('name', 'restaurant_id');
  //   restaurantId.setAttribute('id', 'restaurant_id');
  //   formReview.appendChild(restaurantId);

  //   const reviewerLabel = document.createElement("label");
  //   reviewerLabel.setAttribute('for', 'name');
  //   reviewerLabel.innerHTML = 'Name: ';
  //   formReview.appendChild(reviewerLabel);

  //   const reviewer = document.createElement("input");
  //   reviewer.setAttribute('type', 'text');
  //   reviewer.setAttribute('name', 'name');
  //   reviewer.setAttribute('id', 'name');
  //   reviewer.setAttribute('required', '');
  //   formReview.appendChild(reviewer);

  //   const commentLabel = document.createElement("label");
  //   commentLabel.setAttribute('for', 'comment');
  //   commentLabel.innerHTML = 'Comment: ';
  //   formReview.appendChild(commentLabel);

  //   const comment = document.createElement("textarea");
  //   comment.setAttribute('name', 'comments');
  //   comment.setAttribute('id', 'comments');
  //   comment.setAttribute('cols', '30');
  //   comment.setAttribute('rows', '10');
  //   comment.setAttribute('required', '');
  //   formReview.appendChild(comment);
    
  //   // rating with stars
  //   const rating = document.createElement("input");
  //   rating.setAttribute('type', 'hidden');
  //   rating.setAttribute('name', 'rating');
  //   rating.setAttribute('id', 'rating');
  //   formReview.appendChild(rating);

  //   const ratingLabel = document.createElement('label');
  //   ratingLabel.setAttribute('for', 'rating-container');
  //   ratingLabel.innerHTML = "Rate restaurant: "
  //   formReview.appendChild(ratingLabel);

  //   const ratingContainer = document.createElement("div");
  //   ratingContainer.setAttribute('id', 'rating-container');
  //   ratingContainer.setAttribute('role', 'radiogroup');
  //   ratingContainer.setAttribute('aria-labelledby', 'title-form-review');
  //   ratingContainer.classList.add('rating-container');
  //   console.log(ratingContainer)

  //   //     // Define values for keycodes
  //   var VK_ENTER      = 13;
  //   var VK_SPACE      = 32;
  //   var VK_LEFT       = 37;
  //   var VK_UP         = 38;
  //   var VK_RIGHT      = 39;
  //   var VK_DOWN       = 40;
    
  //   const handleKeyDown = function(e) {
  //     console.log(e);
  //     switch(e.keyCode) {
        
  //       case VK_UP:
  //       case VK_LEFT: {
          
  //         e.preventDefault();
          
  //         this.focusedIdx--;
  //         if (this.focusedIdx < 0)
  //         this.focusedIdx = this.focusedIdx + this.buttons.length;
          
  //         break;
  //       }
        
  //       case VK_DOWN:
  //       case VK_RIGHT: {
          
  //         e.preventDefault();
          
  //         this.focusedIdx = (this.focusedIdx + 1) % this.buttons.length;
          
  //         break;
  //       }
  
  //       case VK_SPACE:
  //         var focusedButton = e.target;
  //         var idx = this.buttons.indexOf(focusedButton);
  //         if (idx < 0)
  //         return;
  //         this.focusedIdx = idx;
  //         break;
          
  //         default:
  //         return;
  //       }
        
  //       // this.changeFocus();
  //     };
      
  //     ratingContainer.addEventListener('keydown', handleKeyDown.bind(this));
  //     // ratingContainer.addEventListener('click', handleClick(this));
      
  //     let itemHighlight;
      
  //   for(var i=1; i<=5; i++) {
  //     const cont = i;
  //     const ratingInput = document.createElement("img");
  //     ratingInput.setAttribute('src', '../img/star_normal.svg');
  //     ratingInput.setAttribute('role', 'radio');
  //     ratingInput.setAttribute('tabindex', '0');
  //     // i == 1? ratingInput.setAttribute('tabindex', '0') : ratingInput.setAttribute('tabindex', '-1');

  //     ratingInput.setAttribute('alt', i+' star');
  //     ratingInput.setAttribute('name', 'rate'+i);
  //     ratingInput.setAttribute('id', 'r'+i);
  //     ratingInput.setAttribute('aria-checked', 'false');
  //     ratingInput.classList.add('test-rating-radio');
      
  //     ratingInput.onclick = function(){
  //       const allElements = document.getElementsByClassName("test-rating-radio");
  //       unlightRating(allElements);

  //       for(var t=1; t<=cont; t++){
  //         higlightRating('r'+t);
  //       }

  //       itemHighlight = cont;
        
  //       const ratingValue = document.getElementById('rating')
  //       ratingValue.setAttribute('value', itemHighlight);

  //       ratingElements = document.getElementsByClassName('test-rating-radio');
  //       for (el of ratingElements){
  //         el.setAttribute('aria-checked', 'false');
  //       }
        

  //       this.setAttribute('aria-checked', 'true');

  //     }

  //     ratingInput.onmouseover = function(){
  //       const allElements = document.getElementsByClassName("test-rating-radio");
  //       unlightRating(allElements);
        
  //       for(var t=1; t<=cont; t++){
  //         higlightRating('r'+t);
  //       }
        
  //     }

  //     ratingInput.onmouseout = function(){
  //       const allElements = document.getElementsByClassName("test-rating-radio");
  //       unlightRating(allElements);
        
  //       for(var t=1; t<=itemHighlight; t++){
  //         higlightRating('r'+t);
  //       }
        
  //     }

  //     ratingContainer.appendChild(ratingInput);

  //   }
  //   formReview.appendChild(ratingContainer);

  //   const submitField = document.createElement("input");
  //   submitField.setAttribute('type', 'submit');
  //   submitField.setAttribute('value', 'submit review');
  //   formReview.appendChild(submitField);

  //   return formReview;

  // } 


/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviews = () => {
  DBHelper.fetchReviewsByRestaurantFromServer(self.restaurant.id)
    // .then(reviews => (console.log(reviews)))
    .then(reviews => fillReviewsHTML(reviews))
    .catch((err) => {
      console.log(err);
     });
}


fillReviewsHTML = (reviews) => {

  console.log(reviews);
  
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
  // li.appendChild(name);
  header.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  date.classList.add('review-date');
  // li.appendChild(date);
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
