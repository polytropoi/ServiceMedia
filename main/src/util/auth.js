    // var hostname = "http://chickenwaffle1.46teagnrws.us-east-1.elasticbeanstalk.com";
    var hostname = "http://localhost:3000";
    var cookie;
    
    function authreq() {

    
    
    // $("#authreq").submit(function( event ) {
    // event.preventDefault();
    var uName = $( "#uname" ).val();
    var uPass = $( "#upass" ).val();
    console.log("tryna submit for uName " + uName);
    var posting = $.ajax({
    url: hostname + "/authreq",
    type: 'POST',
      contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
            uname: uName,
            upass: uPass
            // param2: $('#textbox2').val()
          }),
        success: function( data, textStatus, xhr ){
            console.log(data);
            var r = data.replace(/["']/g, ""); //cleanup
            var resp = r.split('~'); //response is tilde delimited
            // document.cookie = "_id=" + resp[0]; //user id
            // setCookie("_id", resp[0], 3);
            // $( "#logout" ).show();
            // $( "#login" ).hide();
            // $( "#aframe" ).show();
            Cookies.set('_id', resp[0], { expires: 7 });
            $('#response pre').html( "logged in as " + resp[1] );
            cookie = Cookies.get();
            location.href = "./index.html";
           
        },
        error: function( xhr, textStatus, errorThrown ){
            console.log( xhr.responseText );
            $('#response pre').html( xhr.responseText );
            Cookies.remove('_id');
            location.reload();
            // document.cookie = "expires=Thu, 01 Jan 1970 00:00:00"; //set to expired date to delete?
            }
        });
    }

    
function amirite () {
    // var hostname = "http://chickenwaffle1.46teagnrws.us-east-1.elasticbeanstalk.com";




    if (cookie != null && cookie._id != null) {
    console.log("gotsa cookie: " + cookie._id );
    $.get( hostname + "/amirite/" + cookie._id, function( data ) {
        console.log("amirite : " + JSON.stringify(data));
        if (data == 0) {
            // window.location.href = './login.html';
    //  $('#response pre').html( "not logged in" ); 
    //  $("#logout").hide();
    //  $("#login").show();
        } else {
            console.log("welcome " + data);
    //  $('#response pre').html( "logged in as " + data );
    //  $("#login").hide();
    //  $("#logout").show();
            // window.location.href = './index.html';
        }
    });
    } else {
        // window.location.href = './login.html';
    //  $('#response pre').html( "not logged in" );
    //  $("#login").show();
    //  $("#logout").hide();
    
    }
}