
/*
* @function toggleCheckBox
* @desc Toogles the state of a checkbox and updates image indicating state based on aria-checked values
* @param   {Object}  event  -  Standard W3C event object
*/

function toggleCheckbox(event) {

    var node = event.currentTarget

    var image = node.getElementsByTagName('img')[0]

    var state = node.getAttribute('aria-checked').toLowerCase()
  
    if (event.type === 'click' || 
        (event.type === 'keydown' && event.keyCode === 32)
        ) {
            if (state === 'true') {
              node.setAttribute('aria-checked', 'false')
              image.src = '../img/heart_normal.svg'
            }
            else {
              node.setAttribute('aria-checked', 'true')
              image.src = '../img/heart_highlight.svg'
            }  
  
      event.preventDefault()
      event.stopPropagation()
    }
  
}
  
/*
* @function focusCheckBox
* @desc Adds focus to the class name of the checkbox
* @param   {Object}  event  -  Standard W3C event object
*/

function focusCheckbox(event) {
    event.currentTarget.className += ' focus'
}
  
/*
* @function blurCheckBox
* @desc Adds focus to the class name of the checkbox
* @param   {Object}  event  -  Standard W3C event object
*/

function blurCheckbox(event) {
    event.currentTarget.className = event.currentTarget.className .replace(' focus','')
}


fillFavorite = (restaurant_id) => {
    favoriteContainer = document.getElementById('favorite-container');
    favoriteContainer.classList.add('favorite-container');

    let checkboxFavorite = document.createElement('div');
    checkboxFavorite.setAttribute('id', 'checkbox-favorite');
    checkboxFavorite.setAttribute('type', 'checkbox');
    checkboxFavorite.setAttribute('name', 'checkbox-favorite');
    checkboxFavorite.setAttribute('role','checkbox');

    isFavorite = self.restaurant.is_favorite;
    checkboxFavorite.setAttribute('aria-checked', isFavorite);
    checkboxFavorite.setAttribute('tabindex','0');
    checkboxFavorite.classList.add('checkbox-favorite');

    let imageFavorite = document.createElement('img');
    let nameImage = isFavorite == true? "heart_highlight.svg": "heart_normal.svg"
    imageFavorite.setAttribute('src', '../img/' + nameImage);
    imageFavorite.setAttribute('id', 'image-favorite');
    imageFavorite.setAttribute('alt', 'Mark as favorite');
    imageFavorite.setAttribute('name', 'img');

    checkboxFavorite.appendChild(imageFavorite);


    // checkboxFavorite.onmouseover = (event) => {
    //     // console.log(event.target)
    //     event.target.setAttribute('src', '../img/heart_highlight.svg');
    // }

    // // this does not work:
    // checkboxFavorite.onmouseout = (event) => {
    //     let node = event.currentTarget
    //     console.log(node)
    //     let isChecked = node.getAttribute('aria-checked');
    //     console.log (isChecked)
    //     if (isChecked === false) {
    //         console.log("es falso")
    //         node.setAttribute('src', '../img/heart_normal.svg');
    //     }
    // }

    checkboxFavorite.onclick = (event) => {
        toggleCheckbox(event);
        
        DBHelper.toggleFavorite(self.restaurant);
    }

    checkboxFavorite.onkeydown = (event) => {
        toggleCheckbox(event);
    }

    favoriteContainer.appendChild(checkboxFavorite);

}
