    var cookie = Cookies.get();
    amirite();
    function amirite () {
        if (cookie != null && cookie._id != null) {
        // console.log("gotsa cookie: " + cookie._id );
        $.get( "/ami-rite/" + cookie._id, function( data ) {
            // console.log("amirite : " + JSON.stringify(data.domains));
            if (data == 0) {
                window.location.href = './sign_in.html';
            } else {

            let username = data.userName;
            let userid = data.userID;
            let auth = data.authLevel;
            let apps = data.apps;
            let domains = data.domains;
                console.log("username " + username + " authLevel " + auth);
            }
        });
        } else {
            window.location.href = './sign_in.html';
        }
    }