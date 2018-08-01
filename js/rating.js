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
            // when the submit doesn't work, save the content of the form in the pending reviews database
            .catch(e => {

                // convert formData to javascript object because indexedDB doesn't work with formData
                var object = {};
                formData.forEach(function(value, key){
                    object[key] = value;
                });
                // add createdAt to object
                now = Date.now();
                object.createdAt = now;

                DBHelper.savePendingReview(object)
                .then(addPendingReviewToHTML(object))
                .then(form.reset())

                // console.log('The form is saved in pendingReviews');
                
                // register the background sync
                navigator.serviceWorker.ready.then(function(reg) {
                    reg.sync.register('review-submission');
                    // console.log ('Sync registered!!')
                });

            });
        });
        
        form.addEventListener('reload_reviews_event', function(e){
            fillReviews();
        });


    }

    // event listener of the message sended when the conection is ready
    navigator.serviceWorker.addEventListener('message', message => {

        if (message.data === "review-submission") {
    
            DBHelper.fetchPendingReviewsFromIDB()
            .then(revs => {
                revs.forEach(rev => {
                    DBHelper.saveReviewToServer(rev);
                })
                
            })
            .then(DBHelper.clearPendingReviewsIDB(r => console.log(r)));
        }

        if (message.data === "is-favorite-submission") {
            DBHelper.sumbitPendingFavorites();
            debugger
        }
    })

}
    