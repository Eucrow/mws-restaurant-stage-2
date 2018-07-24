window.onload = function () {
    const reload_reviews_event = new Event("reload_reviews_event");
    const offline_event = new Event("offline_event");

    const form = document.getElementById('form-review');
    if (form){
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            formData = new FormData(form)
            // to see the content of FormData:
            // for (var pair of formData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }


            DBHelper.saveReviewToServer(formData).then( () => {
                form.dispatchEvent(reload_reviews_event);
            })
            .then(fillReviews())
            .then(form.reset())
            .catch(e => {

                // convert formData to javascript object because indexedDB doesn't work with formData
                var object = {};
                formData.forEach(function(value, key){
                    object[key] = value;
                });

                DBHelper.savePendingReview(object)
                // .then(fillReviewsOffline())
                .then(addPendingReviewToHTML(object))
                .then(form.reset())

                console.log('The form is saved in pendingReviews');
                
                navigator.serviceWorker.ready.then(function(reg) {
                    reg.sync.register('review-submission');
                    console.log ('Sync registered!!')
                });

            });
        });
        
        form.addEventListener('reload_reviews_event', function(e){
            // console.log('tadá!');
            fillReviews();
        });

        navigator.serviceWorker.addEventListener('message', message => {
            console.log("inside the message event listener");
            // console.log(message);
            if (message.data === "review-submission") {
      
                DBHelper.fetchPendingReviewsFromIDB()
                .then(revs => {
                    console.log("Here I've to save the pendigns reviews");
                    revs.forEach(rev => {
                        DBHelper.saveReviewToServer(rev);
                    })
                    
                })
                .then(DBHelper.clearPendingReviewsIDB(r => console.log(r)));
            }
          })
    }

}
    