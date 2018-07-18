/**
 * Remove the higlight in all the elements (stars) of rating
 */
unlightRating = (e) => {
    for(var r=0; r<e.length; r++){
        e[r].setAttribute('src', '../img/star_normal.svg');
    }
}

/**
 * Higlight an element (star) of the rating
 */
higlightRating = (e) => {
    const elem = document.getElementById(e);
    elem.setAttribute('src', '../img/star_highlight.svg');
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
    console.log(ratingContainer)


    
   
    ratingContainer.addEventListener('keydown', handleKeyDown.bind(this));
    // ratingContainer.addEventListener('click', handleClick(this));
    
    let itemHighlight;

    focusedIdx = 0;
      
    for(var i=1; i<=5; i++) {
      const cont = i;
      const ratingInput = document.createElement("img");
      ratingInput.setAttribute('src', '../img/star_normal.svg');
      ratingInput.setAttribute('role', 'radio');
      ratingInput.setAttribute('tabindex', '0');
      // i == 1? ratingInput.setAttribute('tabindex', '0') : ratingInput.setAttribute('tabindex', '-1');

      ratingInput.setAttribute('alt', i+' star');
      ratingInput.setAttribute('name', 'rate'+i);
      ratingInput.setAttribute('id', 'r'+i);
      ratingInput.setAttribute('aria-checked', 'false');
      ratingInput.classList.add('test-rating-radio');
      
      ratingInput.onclick = function(){
        const allElements = document.getElementsByClassName("test-rating-radio");
        unlightRating(allElements);

        for(var t=1; t<=cont; t++){
          higlightRating('r'+t);
        }

        itemHighlight = cont;
        
        const ratingValue = document.getElementById('rating')
        ratingValue.setAttribute('value', itemHighlight);

        ratingElements = document.getElementsByClassName('test-rating-radio');
        for (el of ratingElements){
          el.setAttribute('aria-checked', 'false');
        }
        

        this.setAttribute('aria-checked', 'true');

      }

      ratingInput.onmouseover = function(){
        const allElements = document.getElementsByClassName("test-rating-radio");
        unlightRating(allElements);
        
        for(var t=1; t<=cont; t++){
          higlightRating('r'+t);
        }
        
      }

      ratingInput.onmouseout = function(){
        const allElements = document.getElementsByClassName("test-rating-radio");
        unlightRating(allElements);
        
        for(var t=1; t<=itemHighlight; t++){
          higlightRating('r'+t);
        }
        
      }

      ratingContainer.appendChild(ratingInput);

    }
    formReview.appendChild(ratingContainer);

    const submitField = document.createElement("input");
    submitField.setAttribute('type', 'submit');
    submitField.setAttribute('value', 'submit review');
    formReview.appendChild(submitField);

    return formReview;

  } 

  
  handleKeyDown = function(e) {
      console.log(e)
    switch(e.keyCode) {
        
        case VK_UP:
        case VK_LEFT: {
            e.preventDefault();
            this.focusedIdx--;
            if (this.focusedIdx < 0)
                this.focusedIdx = this.focusedIdx + 5; //5 is the number of the stars
                e.focus();
                // console.log(this)
            break;
        }
        
        case VK_DOWN:
        case VK_RIGHT: {
            e.preventDefault();
            this.focusedIdx = (this.focusedIdx + 1) % 5;
            break;
        }

        case VK_SPACE:
            var focusedButton = e.target;
            var idx = this.buttons.indexOf(focusedButton);
            if (idx < 0)
            return;
            this.focusedIdx = idx;
            break;
            
        default:
            return;
        }
        
    // this.changeFocus();
};

changeFocus = function() {
    // Set the old button to tabindex -1
    this.focusedButton.tabIndex = -1;
    this.focusedButton.removeAttribute('checked');
    this.focusedButton.setAttribute('aria-checked', 'false');

    // Set the new button to tabindex 0 and focus it
    this.focusedButton = this.buttons[this.focusedIdx];
    this.focusedButton.tabIndex = 0;
    this.focusedButton.focus();
    this.focusedButton.setAttribute('checked', '');
    this.focusedButton.setAttribute('aria-checked', 'true');
  };