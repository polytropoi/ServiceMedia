
const locstyle = "position:fixed;display:block;width:200px;height:400px;right:0px;bottom:0px;background-color:#ffffff;z-index:20;"
let mapZoomInt = "13";
let mapType = "hybrid";
let mapSize = "2048x2048";
let showGeoPanel = false;

let ipLookupData = null;
let currentLocation = [];
let geoEntity = 'geo-location';
let mode = 'map';
let initialized = false;
let gpsElements = null;

let restrictLocData = null;


window.onload = function () {
  let restrictToLocationData = document.getElementById("restrictToLocation");
  if (restrictToLocationData != null) {
   
    
    restrictLocData = JSON.parse(atob(restrictToLocationData.getAttribute("data-location")));
    console.log("restrict location datas: " + JSON.stringify(restrictLocData));
    mode = "nomap";
    UpdateLocationInfo();
  }
  // } else {
  //   console.log("MISSED GEO EL FIRWST PASSS@!");
  //   setTimeout(() => {
  //     restrictToLocationData = document.getElementById("restrictToLocation");
  //     if (restrictToLocationData != null) {  
  //       restrictLocData = JSON.parse(atob(restrictToLocationData.getAttribute("data-location")));
  //       console.log("restrict location datas: " + JSON.stringify(restrictLocData));
  //       mode = "nomap";
  //       UpdateLocationInfo();
  //     }
  //   }, 10);
  // }
}

function UpdateGeoPanel(nwString) {
    

    let d = document.querySelector('.geopanel');
    d.style.visibility = "visible";
    // d.createElement('button')
    // d.setAttribute("style",locstyle);
    var p = d.querySelector('span');
    // p.setAttribute("style","text-align: left;margin:auto;font-size:14px Roboto;");
    p.innerHTML=nwString;
    UpdateButtons();  //reset events after repainting the geopanel
    // ShowHideGeoPanel();
}

function ShowHideGeoPanel () {
  if (mode != "nomap") {
    showGeoPanel = !showGeoPanel;
    if (showGeoPanel) { 
      if (initialized) {
        UpdateLocationInfo();
      }
      // 
    //  SwitchMapStyle();
      let d = document.querySelector('.geopanel');
      d.style.visibility = "visible";
      d.style.display = "block";
      // UpdateLocationInfo();
    } else {
      let d = document.querySelector('.geopanel');
      // d.style.visibility = "hidden";
    }
  }
}



function UpdateButtons() {
  // console.log("sceneLOcations " + JSON.stringify(sceneLocations));
  var locbuttons = document.getElementsByClassName("locbutton");

  var locationClick = function() {
    let lbData = this.id;
    // console.log("lbData " + lbData );
    FlyToMapPosition(lbData.split("_")[0],lbData.split("_")[1], false); //the id is lng +_+ lat 
  };

  for (var i = 0; i < locbuttons.length; i++) {
    locbuttons[i].addEventListener('click', locationClick, false);
  }

  var locrotbuttons = document.getElementsByClassName("locrotbutton");

  var locrotClick = function() {
    RotateCamera(0);
  };

  for (var i = 0; i < locrotbuttons.length; i++) {
    locrotbuttons[i].addEventListener('click', locrotClick, false);
  }
}

function geoip(json){
  // console.log(JSON.stringify(json));
  ipLookupData = json;
}





  
  function DistanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2, unit) { // from https://www.geodatasource.com/developers/javascript
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  } 


  function UpdateLocationInfo() {
    ShowHideGeoPanel();

    gpsElements = document.querySelectorAll(".poi,.geo");
    console.log("MODE IS " + mode + " gpsElements : " + gpsElements.length);
    let index = 0; 
    let markers = "";
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    let range = .05;
    console.log("locdata: " + JSON.stringify(restrictLocData));
    let lat = restrictLocData.latitude;
    let lng = restrictLocData.longitude;
    if (restrictLocData.eventData != null && restrictLocData.eventData != undefined && restrictLocData.eventData.length > 2) {
      let splitchar = null;
      if (restrictLocData.eventData.includes(":")) {
        splitchar = ":";
      }
      if (restrictLocData.eventData.includes("=")) {
        splitchar = "=";
      }
      if (restrictLocData.eventData.includes("~")) {
        splitchar = "~";
      }
      if (restrictLocData.eventData.includes(",")) { //no, use comma for delimiter, should split one level above this
        splitchar = ",";
      }
      if (splitchar != null) {
        let split = restrictLocData.eventData.split(splitchar);
        range = parseFloat(split[1].trim());
        
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
      function success(location) {
          let mostDistant = 0;
          console.log("locatiuon: "+ location.coords.longitude + " " + location.coords.latitude);

          currentLocation = [location.coords.longitude, location.coords.latitude]; //to match the order and form of the mapbox coords
          
          var distance = DistanceBetweenTwoCoordinates(location.coords.latitude, location.coords.longitude, lat, lng);
          console.log("distance " + distance + " and range " + range);

          
          if (distance > range) {
            console.log("not cloese enough!");
            let data = {};
            data.lat = lat;
            data.lng = lng;
            data.range = range;
            data.distance = distance;
            let data64 = btoa(JSON.stringify(data));
            window.location.href = "/landing/geo.html?ld=" + data64;
          }
          if (mode != "mapbox") {
            
          }
      };
      function error(error) { //best location mode not available, try some other stuff if it timed out

        let data = {};
            data.lat = lat;
            data.lng = lng;
            data.range = range;
            // data.distance = "error";
            let data64 = btoa(JSON.stringify(data));
            window.location.href = "/landing/geo.html?ld=" + data64;
          // console.warn('ERROR(' + err.code + '): ' + err.message);
          // switch(error.code) {
          //   case error.PERMISSION_DENIED:
          //     UpdateGeoPanel("User denied the request for Geolocation.");
          //     break;
          //   case error.POSITION_UNAVAILABLE:
          //     UpdateGeoPanel("Location information is unavailable.");

          //     break;
          //   case error.TIMEOUT:
          //     UpdateGeoPanel("The request to get user location timed out.");
              
          //     break;
          //   case error.UNKNOWN_ERROR:
          //     UpdateGeoPanel("An unknown error occurred.");
          //     break;
          // }
      };
    } else {
      let data = {};
      data.lat = lat;
      data.lng = lng;
      data.range = range;
      // data.distance = "error";
      let data64 = btoa(JSON.stringify(data));

      window.location.href = "/landing/geo.html?ld=" + data64;
      
    }
    // if (theModal == null) {
    //   theModal = document.getElementById('theModal');
    // }

  }
  function ReturnMapZoom (mostDistant) {
    let zoom = 20;
    if (mostDistant > 1128.497220 ) {
      zoom = 19;
    } 
    if (mostDistant > 2256.994440 ) {
      zoom = 18;
    } 
    if (mostDistant > 4513.988880 ) {
      zoom = 17;
    } 
    if (mostDistant > 9027.977761 ) {
      zoom = 16;
    } 
    if (mostDistant > 18055.955520 ) {
      zoom = 15;
    } 
    if (mostDistant > 36111.911040 ) {
      zoom = 14;
    } 
    if (mostDistant < 72223.822090 ) {
      zoom = 13;
    } 
    if (mostDistant < 144447.644200 ) {
      zoom = 12;
    } 
    if (mostDistant < 288895.288400 ) {
      zoom = 11;
    } 
    if (mostDistant < 577790.576700 ) {
      zoom = 10;
    } 
    if (mostDistant < 1155581.153000 ) {
      zoom = 9;
    } 
    if (mostDistant < 2311162.307000 ) {
      zoom = 8;
    } 
    if (mostDistant < 4622324.614000 ) {
      zoom = 7;
    } 
    if (mostDistant < 9244649.227000 ) {
      zoom = 6;
    } 
    if (mostDistant < 18489298.450000 ) {
      zoom = 5;
    } 
    if (mostDistant > 36978596.910000) {
      zoom = 4;
    } 
    if (mostDistant > 73957193.820000 ) {
      zoom = 3;
    } 
    if (mostDistant > 147914387.600000 ) {
      zoom = 2;
    } 
    if (mostDistant > 295828775.300000 ) {
      zoom = 1;
    } //max zoom scale is 591657550.500000, found these at https://stackoverflow.com/questions/11454229/how-to-set-zoom-level-in-google-map/11454897

  }

  function ShowLocationMap() {

  }

  



  let theMap = null; //set on init below
  let flying = false;
  let shareLocation = false;
  // let styleIndex = 0;
  // let styleIDs = []
  let rotateOn = false;

  function ZoomIn () {
    if (theMap != null) {
      console.log("zoom " + theMap.getZoom());
      theMap.setZoom(theMap.getZoom() + .5);
      if (rotator != null) 
      cancelAnimationFrame(rotator);
    }
  }
  function ZoomOut () {
    if (theMap != null) {
      theMap.setZoom(theMap.getZoom() - .5);
      if (rotator != null) 
      cancelAnimationFrame(rotator);
    }
  }
  let rotator = null;
  function RotateCamera(timestamp) {
    // rotateOn = !rotateOn;
    if (theMap != null) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    // if (rotateOn) { 
      // if (rotator == null) {
        theMap.rotateTo((timestamp / 1000) % 360, { duration: 0 });
      // }
      
      // Request the next frame of the animation.
      // if (rotateOn)
      rotator = requestAnimationFrame(RotateCamera);
      // } else {
      //   if (rotator != null) {
      //     cancelAnimationFrame(rotator);
      //   }
      // }
    }
  }
  function UpdatePlayerMarkers (){
    console.log("tryna UpdatePlayerMarkers");
  }
  
  // When the user clicks anywhere outside of the modal, close it

  function ShareLocation () {
    if (theModal) {

      theModal.style.display = "block";
    }
    shareLocation = !shareLocation;
    console.log("tryna sharelocation " + shareLocation);
  }

  function MapStyleSelectChange (style) {
    if (theMap != null) {

      console.log("tryna switch to style " + style);

      if (style == "Satellite") {
        theMap.setStyle('mapbox://styles/polytropoi/ckkfufmj103fq17k627oww4ez');
      }
      if (style == "Terrain") {
        theMap.setStyle('mapbox://styles/polytropoi/ckkftoa7x02np17rubtzwe8lj');
      }
      if (style == "Dark") {
        theMap.setStyle('mapbox://styles/polytropoi/ckkftume002vf17pdecs602bp');
      }
      if (style == "Light") {
        theMap.setStyle('mapbox://styles/polytropoi/ckkfvm7h504kx17tib6g7hsrb');
      }
    }
  }

  function UpdateMarkers() {
    if (theMap && currentLocation != []) {

    // let gpsElements = document.querySelectorAll('.poi');

    let currentLocString = "<button class=\x22locbutton\x22 id=\x22"+currentLocation[0]+"_"+currentLocation[1]+"\x22>You Are Here</button><br>";
    // console.log(currentLocString);
    let index = 0; 
    // let poiMarkers = [];
    let isPoi = false;
    for (let i = 0; i < gpsElements.length; i++) {
      
      index++; 
        // create a HTML element for each feature
      // var el = document.createElement('div');
      // el.className = 'marker';
      let lat = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
      let lng = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
      let eventdata = "";
      let label = "";

      if (sceneLocations != undefined && sceneLocations.locations != undefined) {
        for (let m = 0; m < sceneLocations.locations.length; m++) {
          if (gpsElements[i].getAttribute(geoEntity.toString())._id == sceneLocations.locations[m]._id) {//match the id to get the sceneLcoation data
            console.log("gotsa match " + sceneLocations.locations[m].eventData);
            label = sceneLocations.locations[m].label != undefined ? sceneLocations.locations[m].label : sceneLocations.locations[m].name;
            if (sceneLocations.locations[m].markerType == "poi" ) {
              isPoi = true;
            }
          }
        }
      }
      if (isPoi) {
        var distance = DistanceBetweenTwoCoordinates(currentLocation[1], currentLocation[0], lat, lng);
        // console.log("distance " + distance);
        // if (distance > mostDistant) {
        //   mostDistant = distance;
        // }      
        let indexMinusOne = i > 0 ? i - 1 : gpsElements.length - 1;
        let indexPlusOne = i < gpsElements.length - 1 ? i + 1 : 0;
        currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>"+ label + " "+distance.toFixed(2)+ " miles</button><br>";
        // console.log("index " + i + " plusONe " + indexPlusOne +  " minus " + indexMinusOne);
        var popup = new mapboxgl.Popup()
        // .setText("loc " + (i + 1).toString() + ": " + label) //zero = you are here

        // .setHTML('<h4>' + (i + 1).toString() + ' ' + label + 
        .setHTML('<h4>' + label + 
        '<br>distance: '+distance.toFixed(2)+' miles</h4>'+
        '</h4><div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>'+
        // '<div id=\x22'+gpsElements[i].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[i].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-bullseye fa-2x\x22></i><span class=\x22tooltiptext\x22>Center</span></div>'+
        '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-link fa-2x\x22></i><span class=\x22tooltiptext\x22>Link</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-envelope fa-2x\x22></i><span class=\x22tooltiptext\x22>Messages</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-camera fa-2x\x22></i><span class=\x22tooltiptext\x22>Pictures</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-walking fa-2x\x22></i><span class=\x22tooltiptext\x22>Directions</span></div>'+
        '<div id=\x22'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-arrow-circle-right fa-2x\x22></i><span class=\x22tooltiptext\x22>Next Location</span></div>')
        .addTo(theMap);
        
        let marker = new mapboxgl
          .Marker()
            .setLngLat([gpsElements[i].getAttribute(geoEntity.toString()).longitude, gpsElements[i].getAttribute(geoEntity.toString()).latitude])
            .addTo(theMap)
            .setPopup(popup);
          popup.remove();
          // HideMarkers();
      }
    }
    UpdateGeoPanel(currentLocString);
    }
  }
  
  let yahMarker = null;

  function SetYouAreHereMarker () {  //do this for all players
    if (theMap && currentLocation != []) {

      console.log("SOCKETID IS  " + socket.id);
      let playerData = ReturnPlayerData(); //roomusers from socket connection
      let color = "blue";
      let un = "";
      if (playerData != null) {

        let userSplit = playerData.split("~"); //color appended to username after tilde on server

        if (userSplit.length > 1) {
          color = userSplit[1];
          if (!color.includes("#")) {
              color = "#" + color;
          }
          un = userSplit[0];
        }
      }
      if (yahMarker == null) {
        console.log("creating yahMarker");
        let gpsElementsLength = gpsElements.length - 1;
        var popup = new mapboxgl.Popup()
        
        .setHTML('<h4>' + un + ' - you are here' +
        '</h4>'+
        // '<div id=\x22'+currentLocation[0]+'_'+currentLocation[1]+'\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-bullseye fa-2x\x22></i><span class=\x22tooltiptext\x22>Center</span></div>'+
        '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-link fa-2x\x22></i><span class=\x22tooltiptext\x22>Link</span></div>')
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-envelope fa-2x\x22></i><span class=\x22tooltiptext\x22>Messages</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-camera fa-2x\x22></i><span class=\x22tooltiptext\x22>Pictures</span></div>')
        .addTo(theMap);
        yahMarker = new mapboxgl
        .Marker({color: color})
          .setLngLat([currentLocation[0], currentLocation[1]])
          .addTo(theMap)
          .setPopup(popup);
        popup.remove();  
        // HideMarkers();
      } else {
        yahMarker.setLngLat([currentLocation[0], currentLocation[1]]);
      }

      var sharelocbutton = document.getElementById("sharelocation")
      var sharelocClick = function() {
        ShareLocation();
      };
      if (sharelocbutton != null)
      sharelocbutton.addEventListener('click', sharelocClick, false);
      // ShowHideGeoPanel();
    }
  }
  function FlyToMapPosition (lng, lat, rotate) {
    // console.log("tryna fly to " + lng + lat);
    // cancelAnimationFrame();
    ShowHideGeoPanel();
    let coordinates = [lng, lat];
    if (theMap) {
      // console.log("gotsa map!");
      if (rotator != null) {
        cancelAnimationFrame(rotator);
      }
    
      theMap.flyTo({
        center: coordinates,
        essential: false
        });
      theMap.fire('flystart');
      theMap.on('moveend', function(e){
          if(flying) {
            theMap.fire('flyend');
            if (rotate) {
              RotateCamera(0);
            }
            //other things to do when ready
          }
        });
      }
  }
  function HideMarkers() {
    let markers = document.getElementsByClassName("marker");
    for (let i = 0; i < markers.length; i++) {
          markers[i].style.visibility = "hidden";
      }
  }
  // function onObjectMouseOver(e) {
  //   //do something in the UI such as adding help or showing this object attributes
  //   console.log("mouseover " + e);
  // }
