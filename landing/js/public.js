function getScenes() {
    console.log("tryna getScenes()");
	var resultElement = document.getElementById('scenesInner');
  	resultElement.innerHTML = '';
	axios.get('publicscenes')
  .then(function (response) {
    // console.log(JSON.stringify(response));
	resultElement.innerHTML = showScenes(response);
  })
  .catch(function (error) {
    console.log(error);
    resultElement.innerHTML = generateErrorHTMLOutput(error);
  });
}

function showScenes(response) {
	var jsonResponse = response.data;
    var arr = jsonResponse.availableScenes;
    shuffle(arr);
var html = "<div class=\x22row\x22>";
     for(var i = 0; i < arr.length; i++) {
      // console.log("root" + root);
    //   var audioHtml = '<div><audio controls><source src=\x22#\x22 type=\x22audio/mp3\x22></audio></div><hr>';
    //         // var audioHtml = '<div class=\x22col-md-12 pull-left\x22><audio controls><source src=\x22#\x22 type=\x22audio/mp3\x22></audio></div><hr>';   
    //   var keynoteHtml = "";
    //   var descHtml = "";
    //   if (arr[i].primaryAudioUrl != undefined) {
    //       audioHtml = '<div><audio controls><source src=\x22' + arr[i].primaryAudioUrl  + '\x22 type=\x22audio/mp3\x22></audio></div><hr>';
    //   }
    //   if (arr[i].scenePrimaryAudioStreamURL != undefined) {
    //       audioHtml = '<div><audio controls><source src=\x22' + arr[i].scenePrimaryAudioStreamURL  + '\x22 type=\x22audio/mp3\x22></audio></div><hr>';
    //   }
    // <span class="thumbtext">{{scene.sceneTitle}} - {{scene.sceneKey}}</span><br>
    // <a style="color: black" data-toggle="tooltip" data-placement="top" title="App Homepage" href="http://{{scene.sceneDomain}}">{{scene.sceneDomain}} </a><div>
      
    //   if (arr[i].sceneKeynote != null) {
    //       keynoteHtml = '<div >Keynote: ' + arr[i].sceneKeynote + '</div><br>';
    //   }
    //   if (arr[i].sceneDescription != null) {
    //       descHtml = '<div >Description: ' + arr[i].sceneDescription + '</div><br>';
    //   }
      html = html + '<div class=\x22my-2 col-md-3\x22>' + 
      '<div class=\x22bg-dark card\x22>' +
          // '<a class=\x22text-light\x22 href=\x22https://servicemedia.net/qrcode/' +  arr[i].sceneKey + '\x22>QR Code</a>' +      
          '<a class=\x22text-light\x22 href=\x22http://'+location.host+'/qrcode/' +  arr[i].sceneKey + '\x22>QR Code</a>' +      
      // // '<div style=\x22background-image: url(' + arr[i].scenePostcardHalf + ');background-repeat: no-repeat; width: 100%;height: 100%;\x22>' +
          '<a href=\x22http://'+location.host+'/webxr/'+ arr[i].sceneKey + '\x22 target=\x22_blank\x22>' +
          '<img src='+ arr[i].scenePostcardHalf + ' style=\x22background-color: #000;\x22 class=\x22img-thumbnail\x22></a>' +
        //    audioHtml +
           // "</div>" +
           // "<div class=\x22media-body\x22>" + 
           // '<s/div>' +
        //   'Last Update: ' + arr[i].sceneLastUpdate +
          '<span class=\x22text-light\x22>' + arr[i].sceneTitle + ' <br><a href=\x22http://'+ arr[i].sceneDomain+'\x22>' + arr[i].sceneDomain +  '</a></span> ' +

          '</div></div>';

     };
     return  html + "</div>";

}
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};
function generateErrorHTMLOutput(error) {
  return  '<h4>Result</h4>' + 
          '<h5>Message:</h5> ' + 
          '<pre>' + error.message + '</pre>' +
          '<h5>Status:</h5> ' + 
          '<pre>' + error.response.status + ' ' + error.response.statusText + '</pre>' +
          '<h5>Headers:</h5>' + 
          '<pre>' + JSON.stringify(error.response.headers, null, '\t') + '</pre>' + 
          '<h5>Data:</h5>' + 
          '<pre>' + JSON.stringify(error.response.data, null, '\t') + '</pre>'; 
}