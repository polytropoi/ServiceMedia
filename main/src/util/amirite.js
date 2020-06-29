import Cookies from './js.cookie.mjs';
export default function amirite (){
    // var hostname = "http://chickenwaffle1.46teagnrws.us-east-1.elasticbeanstalk.com";

    var hostname = "http://localhost:3000";    
    var cookie = Cookies.get();
    var selected = [];
    console.log("cookies: " + JSON.stringify(cookie));

    if (cookie != null && cookie._id != null) {
    console.log("gotsa cookie: " + cookie._id );
    $.get( hostname + "/amirite/" + cookie._id, function( data ) {
        console.log("amirite : " + JSON.stringify(data));
        if (data == 0) {
            // window.location.href = './login.html';
        } else {
            console.log("welcome " + data);
        }
    });
    } else {
        // window.location.href = './login.html';
    
    }
}
