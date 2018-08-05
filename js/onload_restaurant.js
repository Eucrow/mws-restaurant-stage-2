window.onload = function () {
    // const reload_reviews_event = new Event("reload_reviews_event");
    const offline_event = new Event("offline_event");
    
    navigator.serviceWorker.addEventListener('message', message => {

        if (message.data === "review-submission") {
            // when the conection is ready, send the pendigs reviews to server
            // console.log ("sending a review-submission message")
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
        }
    })

}
    