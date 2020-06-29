
import amirite from '../util/amirite.js';

// amirite();

var datahtml = "";
var jsonData = {};
var appid = "5dade6edb761a1071f171fb1";
// getData();
function getData() {
    var resultElement = document.getElementById('app');
    resultElement.innerHTML = '';
    // axios.get('https://servicemedia.net/available_domain_scenes/kork.us')
    axios.get('http://localhost:3000/totalscores_aka/' + appid)
  .then(function (response) {
    console.log(JSON.stringify(response));
    // resultElement.innerHTML = showData(response);
    datahtml = showData(response);
  })
//   .catch(function (error) {
//     console.log(error);
//     // resultElement.innerHTML = showError(error);
//     datahtml = showError(error);
//   });
}
        
    
 function showData(response) {
    var jsonResponse = response.data;
    var arr = jsonResponse.totalscores;
    var tableHead = "<table id=\x22dataTable\x22 class=\x22display\x22 style=\x22width:100%\x22>"+
            "<thead>"+
            "<tr>"+
            "<th>Name</th>"+
            "<th>Total</th>"+
            "<th>Rank</th>"+
        "</tr>"+
    "</thead>"+
    "<tbody>";
    var tableBody = "";
    for(var i = 0; i < arr.length; i++) {
        tableBody = tableBody +
        "<tr>" +
        "<td>" + arr[i].scoreName + "</td>" +
        "<td>" + arr[i].scoreTotal + "</td>" +
        "<td>" + arr[i].rank + "</td>" +
        "</tr>";
    }
    var tableFoot =  "</tbody>"
    "<tfoot>"
        "<tr>"
            "<th>Name</th>" +
            "<th>Total</th>" +
            "<th>Rank</th>" +
        "</tr>" +
    "</tfoot>" +
    "</table>";
    return tableHead + tableBody + tableFoot;
    
    // for(var i = 0; i < arr.length; i++) {
            // console.log(JSON.stringify(arr[i]));
    //   var audioHtml = "";
    //   var keynoteHtml = "";
    //   var descHtml = "";
    //   if (arr[i].primaryAudioUrl != undefined) {
    //         audioHtml = '<div class=\x22col-md-12 pull-left\x22><audio controls><source src=\x22' + arr[i].primaryAudioUrl  + '\x22 type=\x22audio/mp3\x22></audio></div><hr>'
    //   }   
    //   if (arr[i].sceneKeynote != null) {
    //       keynoteHtml = '<div >Keynote: ' + arr[i].sceneKeynote + '</div><br>'
    //   }
    //   if (arr[i].sceneDescription != null) {
    //       descHtml = '<div >Description: ' + arr[i].sceneDescription + '</div><br>'  
    //   }
    //     html = html + '<div class=\x22col-md-4\x22><div class=\x22thumbnail\x22>' +
    //             '<div>Last Update: ' + arr[i].sceneLastUpdate + '</div>'  +
    //             '<a href=\x22/'+ arr[i].sceneKey + '/index.html\x22 target=\x22_blank\x22>' +
    //             '<img src='+ arr[i].scenePostcardHalf + ' class=\x22img-thumbnail\x22></a>' +
    //             '<a class=\x22btn btn-sm btn-dark pull-right \x22 href=\x22https://servicemedia.net/qrcode/' +  arr[i].sceneKey + '\x22>QR Code</a>' +
    //             '<div class=\x22pull-left caption\x22> <h4><small> Title: </small>' + arr[i].sceneTitle + '<br><small> Key: </small>' + arr[i].sceneKey +  '</h4> ' +
    //             '</div></div></div></div></div>';
    // };
    // return  html;

}

function showError(error) {
  return  '<h4>Result</h4>' + 
          '<h5>Message:</h5> ' + 
          '<pre>' + error + '</pre>';
        //   '<h5>Status:</h5> ' + 
        //   '<pre>' + error.response.status + ' ' + error.response.statusText + '</pre>' +
        //   '<h5>Headers:</h5>' + 
        //   '<pre>' + JSON.stringify(error.response.headers, null, '\t') + '</pre>' + 
        //   '<h5>Data:</h5>' + 
        //   '<pre>' + JSON.stringify(error.response.data, null, '\t') + '</pre>'; 
}

export default (props) => {
var exhtml = "<div>" +
        "<h2> Welcome to the scores page </h2>" +
        "</div>" + datahtml +
        "<div></div>" +
        "<script>$(document).ready(function() {" +
            "$('#maintable').DataTable();" +
        "});</script>";
return(exhtml);
// $('#maintable').DataTable();
}
export {getData, showData, showError};