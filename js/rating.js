window.onload = function () {

 

    const reload_reviews_event = new Event("reload_reviews_event"); 

    const form = document.getElementById('form-review');
    if (form){
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            formData = new FormData(form)
            // to see the content of FormData:
            // for (var pair of formData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }
            fetch(`${DBHelper.DATABASE_URL}/reviews`, {
                method: 'POST',
                body: formData
            })
            .then( () => {
                form.dispatchEvent(reload_reviews_event);
            })
            // .then(response => console.log(response))
            // .then(fillReviews())
            // .then(form.reset())
            // .catch(e => console.log(e));
        });
        
        form.addEventListener('reload_reviews_event', function(e){
            // console.log('tadá!');
            fillReviews();
        })
    }

}
    