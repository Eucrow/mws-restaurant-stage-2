/**
 * Remove the higlight in all the elements (stars) of rating
 */
unlightRating = () => {
    const elements = document.getElementsByClassName("rating-radio");

    for(var r=0; r<elements.length; r++){
        elements[r].setAttribute('src', '../img/star_normal.svg');
        // console.log("he desmarcado la estrella " + r);
    }
}

/**
 * Higlight an image (star) of the rating
 */
higlightRatingImage = (element) => {
    const elem = document.getElementById(element);
    elem.setAttribute('src', '../img/star_highlight.svg');
}

/**
 * Highlight an image (star) and unhighlight??? the rest of images
 */
highlightRating = (current) => {

    // const elements = document.getElementsByClassName("rating-radio");

    unlightRating();
    if (current == 0){
        return;
    }
    for(var t=1; t<=current; t++){
       higlightRatingImage('r'+t);
    }
}

/**
 * Define values for keycodes
 */
var VK_ENTER      = 13;
var VK_SPACE      = 32;
var VK_LEFT       = 37;
var VK_UP         = 38;
var VK_RIGHT      = 39;
var VK_DOWN       = 40;
var VK_TAB        = 9;

// variable to manage the star rating focused
var focusedIdx = 0;

// get the rate from id element (r1, r2...)
getRateFromId = (id) => {
    idx = Number(id.substr(1,1));
    return idx;
}

updateRatingField = (rate) => {
    const ratingValue = document.getElementById('rating')
    ratingValue.setAttribute('value', rate);
}

updateRate = (id) => {
    // change aria-checked and tabindex attribute of all the elements
    ratingElements = document.getElementsByClassName('rating-radio');
    for (el of ratingElements){
      el.setAttribute('aria-checked', 'false');
      el.setAttribute('tabindex', "-1");
    }

    // update aria-checked ant tabindex fo the selected element
    console.log(id)
    updateRatingElement = document.getElementById(id);
    updateRatingElement.setAttribute('aria-checked', 'true');
    updateRatingElement.setAttribute('tabindex', '0');
    
    rate = getRateFromId(id);
    updateRatingField(rate)
}

fillFormReview = (restaurant_id) => {

    const formReview = document.getElementById('form-review');

    const titleFormReview = document.createElement("h3");
    titleFormReview.innerHTML = "Send your own review:";
    titleFormReview.setAttribute('id', 'title-form-review');
    formReview.appendChild(titleFormReview);

    const restaurantId = document.createElement("input");
    restaurantId.setAttribute('type', 'hidden');
    restaurantId.setAttribute('value', restaurant_id);
    restaurantId.setAttribute('name', 'restaurant_id');
    restaurantId.setAttribute('id', 'restaurant_id');
    formReview.appendChild(restaurantId);

    const reviewerLabel = document.createElement("label");
    reviewerLabel.setAttribute('for', 'name');
    reviewerLabel.innerHTML = 'Name: ';
    formReview.appendChild(reviewerLabel);

    const reviewer = document.createElement("input");
    reviewer.setAttribute('type', 'text');
    reviewer.setAttribute('name', 'name');
    reviewer.setAttribute('id', 'name');
    reviewer.setAttribute('required', '');
    formReview.appendChild(reviewer);

    const commentLabel = document.createElement("label");
    commentLabel.setAttribute('for', 'comment');
    commentLabel.innerHTML = 'Comment: ';
    formReview.appendChild(commentLabel);

    const comment = document.createElement("textarea");
    comment.setAttribute('name', 'comments');
    comment.setAttribute('id', 'comments');
    comment.setAttribute('cols', '30');
    comment.setAttribute('rows', '10');
    comment.setAttribute('required', '');
    formReview.appendChild(comment);
    
    // rating with stars
    const rating = document.createElement("input");
    rating.setAttribute('type', 'hidden');
    rating.setAttribute('name', 'rating');
    rating.setAttribute('id', 'rating');
    formReview.appendChild(rating);

    const ratingLabel = document.createElement('label');
    ratingLabel.setAttribute('for', 'rating-container');
    ratingLabel.innerHTML = "Rate restaurant: "
    formReview.appendChild(ratingLabel);

    const ratingContainer = document.createElement("div");
    ratingContainer.setAttribute('id', 'rating-container');
    ratingContainer.setAttribute('role', 'radiogroup');
    ratingContainer.setAttribute('aria-labelledby', 'title-form-review');
    ratingContainer.classList.add('rating-container');

   
    ratingContainer.addEventListener('keydown', handleKeyDown.bind(this));

    focusedIdx = 0;
      
    for(var i=1; i<=5; i++) {
      const cont = i;
      const ratingInput = document.createElement("img");
      ratingInput.setAttribute('src', '../img/star_normal.svg');
      ratingInput.setAttribute('role', 'radio');
      i == 1? ratingInput.setAttribute('tabindex', '0') : ratingInput.setAttribute('tabindex', '-1');
      
      ratingInput.setAttribute('alt', i+' star');
      ratingInput.setAttribute('name', 'rate'+i);
      ratingInput.setAttribute('id', 'r'+i);
      ratingInput.setAttribute('aria-checked', 'false');
      ratingInput.classList.add('rating-radio');

      ratingInput.onfocus = function() {
        if (focusedIdx == 0) {
            focusedIdx = 1;
            unlightRating();
            highlightRating(1);
            updateRate ('r1');
        }
      }

      ratingInput.onclick = function(){
        unlightRating();

        for(var t=1; t<=cont; t++){
            higlightRatingImage('r'+t);
        }

        focusedIdx = cont;
        
        updateRatingField(focusedIdx);
        updateRate(this.id)

      }

      ratingInput.onmouseover = function(e){
        idx = e.target.id
        currentIndex = Number(idx.substr(1,1));
        
        unlightRating();
        highlightRating(currentIndex);
        
      }

      ratingInput.onmouseout = function(){
        unlightRating();
        
        for(var t=1; t<=focusedIdx; t++){
            higlightRatingImage('r'+t);
        }
        
      }

      ratingContainer.appendChild(ratingInput);

    }
    formReview.appendChild(ratingContainer);

    const submitField = document.createElement("input");
    submitField.setAttribute('type', 'submit');
    submitField.setAttribute('value', 'submit review');
    submitField.setAttribute('id', 'submitButton');

    submitField.onclick = function () {
        unlightRating();
    }
    formReview.appendChild(submitField);

    return formReview;

} 

// Helper function to convert NodeLists to Arrays
function slice(nodes) {
    return Array.prototype.slice.call(nodes);
    }

handleKeyDown = function(e) {
    let focusedRating;

    switch(e.keyCode) {
        
        case VK_UP:
        case VK_LEFT: {
            e.preventDefault();
            focusedIdx--;
            if (focusedIdx <= 0){
                focusedIdx = 5; //5 is the number of the stars
            }
            const elementRating = document.getElementById('r' + focusedIdx);
            elementRating.focus();
            updateRate('r' + focusedIdx);
            break;
        }
        
        case VK_DOWN:
        case VK_RIGHT: {
            e.preventDefault();
            focusedIdx++;
            if (focusedIdx > 5) {
                focusedIdx = 1;
            }
            const elementRating = document.getElementById('r' + focusedIdx);
            elementRating.focus();
            updateRate('r' + focusedIdx);
            break;
        }

        
        case VK_SPACE:{
            e.preventDefault();
            const selectorsRating = slice(document.querySelectorAll('.rating-radio'));
            focusedRating = e.target;
            const idx = selectorsRating.indexOf(focusedRating) + 1;

            updateRate(focusedRating.id);

            if (idx < 0)
                return;
            focusedIdx = idx;
            const submitButton = document.getElementById('submitButton');
            submitButton.focus();
            break;
        }
            
        default:
            return;
    }
    
    unlightRating();
    highlightRating(focusedIdx);
};
