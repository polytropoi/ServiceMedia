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

let data_location_
let doBuildings = false;
let doTerrain = false;


AFRAME.registerComponent('location_init_ar', { 
  schema: {
    // url: {default: ''},
    gpsThings: {default: ''}
    },
  init: function () {
    geoEntity = 'gps-position';
    
    UpdateLocationInfo();
  }
});
AFRAME.registerComponent('location_init', { 
  schema: {
    // url: {default: ''},
    gpsThings: {default: ''}
    },
  init: function () {
    // geoEntity.toString() = 'gps-entity-place'
    UpdateLocationInfo();
  }
});
AFRAME.registerComponent('location_restrict', { 
  schema: {
    // url: {default: ''},
    gpsThings: {default: ''}
    },
  init: function () {
    // mode = 'restrict';
    UpdateLocationInfo();
  }
});
AFRAME.registerComponent('location_restrict_ar', { 
  schema: {
    // url: {default: ''},
    gpsThings: {default: ''}
    },
  init: function () {
    geoEntity = 'gps-entity-place';
    UpdateLocationInfo();
  }
});

AFRAME.registerComponent('geo-location', {  //used instead of gps-entity-place when not arjs 
  schema: {
    latitude: {default: 0},
    longitude: {default: 0}
    },
  init: function () {
    
  }
});

function UpdateGeoPanel(nwString) {
    

    let d = document.querySelector('.geopanel');
    // d.style.visibility = "visible";
    // d.createElement('button')
    // d.setAttribute("style",locstyle);
    var p = d.querySelector('span');
    // p.setAttribute("style","text-align: left;margin:auto;font-size:14px Roboto;");
    p.innerHTML=nwString;
    UpdateButtons();  //reset events after repainting the geopanel
    // ShowHideGeoPanel();
}

function ShowHideGeoPanel () {
  showGeoPanel = !showGeoPanel;
  console.log("tryna showhidegeopanle " + showGeoPanel);
  if (showGeoPanel) { 
    if (initialized) {
      UpdateLocationInfo();
    }
    // 
  //  SwitchMapStyle();
    
    let d = document.querySelector('.geopanel');
    d.style.visibility = "visible";
    d.style.display = "block";
    // showGeoPanel = false;
    // UpdateLocationInfo();
  } else {
    let d = document.querySelector('.geopanel');
    d.style.visibility = "hidden";
    d.style.display = "none";
    // showGeoPanel = true;
  }
}

function PopupNextPreviousButtons(locstring) {
  console.log(locstring);
  // let lbData = loc;
  // console.log("lbData " + lbData );
  FlyToMapPosition(locstring.split("_")[0],locstring.split("_")[1], false);
  const popup = document.getElementsByClassName('mapboxgl-popup');
  if ( popup.length ) {
      popup[0].remove();  
  }
}
function PopupLinkButtons (href) {
  if (href.length > 5) {
    var a = document.createElement('a');
    a.target="_blank";
    a.href=href;
    a.click();
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
    // ShowHideGeoPanel();

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
      function success(location) {
          let mostDistant = 0;
          console.log("locatiuon: "+ location.coords.longitude + " " + location.coords.latitude);

          currentLocation = [location.coords.longitude, location.coords.latitude]; //to match the order and form of the mapbox coords
          for (var i = 0; i < gpsElements.length; i++) {
            if (gpsElements[i].classList.contains('poi')) {
            console.log("element has poi class: " + gpsElements[i].id + " " + geoEntity);
            let lat = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
            let lng = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
            console.log("tryna get distance to " + lat + " " + lng);
            index++; //zero index is used for player position in mapURL below
            // console.log(currentLocString);

            let fromToValues = {};
            fromToValues.from = {};
            fromToValues.to = {};
            fromToValues.from.latitude = location.coords.latitude;
            fromToValues.from.longitude = location.coords.longitude;
            fromToValues.to.latitude = lat;
            fromToValues.to.longitude = lng;
            fromToValues.formula = geolocator.DistanceFormula.HAVERSINE;
            fromToValues.unitSystem = geolocator.UnitSystem.METRIC;
            
            //var distance = geolocator.calcDistance(fromToValues);
            var distance = DistanceBetweenTwoCoordinates(location.coords.latitude, location.coords.longitude, lat, lng);
            console.log("distance " + distance);
            if (distance > mostDistant) {
              mostDistant = distance;
            }
            if (distance > range) {
              console.log("not cloese enough!");
              let data = {};
              data.lat = lat;
              data.lng = lng;
              data.range = range;
              data.distance = distance;
              let data64 = btoa(JSON.stringify(data));
              // window.location.href = "/landing/geo.html?ld=" + data64;
            }

            // let marker = new mapboxgl
            // let eventdata = "";
            // let label = "";
            // for (let m = 0; m < sceneLocations.locations.length; m++) {
            //   if (gpsElements[i].getAttribute(geoEntity.toString())._id == sceneLocations.locations[m]._id) {//match the id to get the sceneLcoation data
            //     console.log("gotsa match " + sceneLocations.locations[m]);
            //     label = sceneLocations.locations[m].name; // to do : event data
            //   }
            // }
            // currentLocString = currentLocString + "\nLocation "+index +" distance: " +distance.toFixed(3)+ "<br>";
            // currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>"+index +" " + label + " "+distance.toFixed(2)+ " km</button><br>";
            console.log("mode is " + mode);
            if (mode != "mapbox") {
              console.log("NOT MAPBOX");
              let currentLocString = "<button class=\x22locbutton\x22 id=\x22"+location.coords.longitude+"_"+location.coords.latitude+"\x22>0 You Are Here</button><br>";
              currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>Location "+index +" "+distance.toFixed(2)+ " miles</button><br>";
              markers = markers + "&markers=color:red%7Clabel:"+index+"%7C" + gpsElements[i].getAttribute(geoEntity.toString()).latitude+ "," + gpsElements[i].getAttribute(geoEntity.toString()).longitude;
              // console.log(markers);
              let gpsThing = {};
              gpsThing.currentLatitude = location.coords.latitude;
              gpsThing.currentLongitude = location.coords.longitude;
              gpsThing.latitude = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
              gpsThing.longitude = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
              gpsThing.index = index;
              gpsThing.mapURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + gpsThing.latitude + "," + gpsThing.longitude + 
              "&zoom=17&size=2048x2048&maptype=hybrid&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:red%7Clabel:"+index+"%7C" + gpsThing.latitude + "," + gpsThing.longitude;
              // gps.data.push(gpsThing);
              let gpsPanel = document.createElement("a-entity");
              var sceneEl = document.querySelector('a-scene');
              sceneEl.appendChild(gpsPanel);
              // gpsElements[i].appendChild(gpsPanel);
              gpsPanel.setAttribute('poi-map-materials', 'jsonData', JSON.stringify(gpsThing));
              //                   let pos = gpsElements[i].getAttribute('position').x + " " + (gpsElements[i].getAttribute('position').y + 3) + " " + gpsElements[i].getAttribute('position').z;
              // gpsPanel.setAttribute('position', pos);
              // gpsPanel.setAttribute('position', gpsElements[i].getAttribute('position'));
              gpsPanel.setAttribute('look-at', '#player');
            } else {
              UpdateMarkers();
              
            }
          } else {
              console.log("non poi geoElement");
          }
        }
            if (mode != "mapbox") {
              // UpdateGeoPanel(currentLocString);
            
            let mapEl = document.getElementById('youAreHere');
            mapJSON = {};
            mapJSON.mapURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + location.coords.latitude + "," + location.coords.longitude + // shows everhthing, need to scale zoom by max distance
            "&zoom="+ReturnMapZoom(mostDistant)+"&size=2048x2048&maptype=hybrid&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:green%7Clabel:0%7C" + location.coords.latitude + "," + location.coords.longitude + markers;
            mapEl.setAttribute('map-materials', 'jsonData', JSON.stringify(mapJSON));
            // $(".map-overlay").css('visibility','visible');
            // $(".map-overlay").backstretch(mapURL);
            } else {
              SetYouAreHereMarker();
            }


      };
      function error(error) { //best location mode not available, try some other stuff if it timed out
          // console.warn('ERROR(' + err.code + '): ' + err.message);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              UpdateGeoPanel("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              UpdateGeoPanel("Location information is unavailable.");
              if (ipLookupData != null) {
                UpdateGeoPanel("position 0 - \nlatitude: " + ipLookupData.latitude + " longitude: " + ipLookupData.longitude);
              }
              break;
            case error.TIMEOUT:
              UpdateGeoPanel("The request to get user location timed out.");
              if (ipLookupData != null) {
                console.log("iplookup mode");
                gpsElements = document.querySelectorAll(".poi,.geo"); //these will have a different target attribute that needs getting, depending on if arjs or not (geo-location vs gps-entity-place), s the geoEntity var
                console.log(gpsElements.length + " IPLoikupDatas " + JSON.stringify(ipLookupData));
                let currentLocString = "Location 0 - You Are Here (via ip)<br>";
                UpdateGeoPanel(currentLocString);
                let mostDistant = 0;
                // console.log(JSON.stringify(gpsElements));
                currentLocation = [ipLookupData.longitude, ipLookupData.latitude]; 
                // SetYouAreHereMarker();
                for (var i = 0; i < gpsElements.length; i++) {
                  if (gpsElements[i].classList.contains('poi')) {
                    for (let name of gpsElements[i].getAttributeNames()) {
                      let value = gpsElements[i].getAttribute(name);
                      // console.log(name, value);
                    }
                    index++; //zero index is used for player position in mapURL below

                    let fromToValues = {};
                    fromToValues.from = {};
                    fromToValues.to = {};
                    fromToValues.from.latitude = ipLookupData.latitude;
                    fromToValues.from.longitude = ipLookupData.longitude;
                    fromToValues.to.latitude = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
                    fromToValues.to.longitude = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
                    fromToValues.formula = geolocator.DistanceFormula.HAVERSINE;
                    fromToValues.unitSystem = geolocator.UnitSystem.METRIC;

                    var distance = geolocator.calcDistance(fromToValues);
                    
                    if (distance > mostDistant) {
                      mostDistant = distance;
                    }
                    // if (distance > .05) {
                    //   window.location.href = "/landing/gf_1.html";
                    // }

                      currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>Location "+index +"</button> distance: " +distance.toFixed(3)+ " miles<br>";

                      markers = markers + "&markers=color:red%7Clabel:"+index+"%7C" + gpsElements[i].getAttribute(geoEntity.toString()).latitude+ "," + gpsElements[i].getAttribute(geoEntity.toString()).longitude;
                      // console.log(markers);
                      let gpsThing = {};
                      gpsThing.currentLatitude = ipLookupData.latitude;
                      gpsThing.currentLongitude = ipLookupData.longitude;
                      gpsThing.latitude = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
                      gpsThing.longitude = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
                      gpsThing.index = index;
                      gpsThing.mapURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + gpsThing.latitude + "," + gpsThing.longitude + 
                      "&zoom=14&size=2048x2048&maptype=hybrid&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:red%7Clabel:"+index+"%7C" + gpsThing.latitude + "," + gpsThing.longitude;
                      // gps.data.push(gpsThing);
                    if (mode != 'mapbox') {
                      let gpsPanel = document.createElement("a-entity");
                      gpsElements[i].appendChild(gpsPanel);
                      gpsPanel.setAttribute('poi-map-materials', 'jsonData', JSON.stringify(gpsThing));
                      // let pos = gpsElements[i].getAttribute('position').x + " " + (gpsElements[i].getAttribute('position').y + 3) + " " + gpsElements[i].getAttribute('position').z;
                      // gpsPanel.setAttribute('position', pos);
                      // gpsPanel.setAttribute('position', gpsElements[i].getAttribute('position'));
                      gpsPanel.setAttribute('look-at', '#player');
                    } else {
                      UpdateMarkers();
                      
                    }
                  }
                }
                SetYouAreHereMarker();
                UpdateGeoPanel(currentLocString);
                let mapEl = document.getElementById('youAreHere');
                mapJSON = {};
                mapJSON.mapURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + ipLookupData.latitude + "," + ipLookupData.longitude + // shows everhthing, need to scale zoom by max distance
                "&zoom="+ReturnMapZoom(mostDistant)+"&size=2048x2048&maptype=hybrid&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:green%7Clabel:0%7C" + ipLookupData.latitude + "," + ipLookupData.longitude + markers;
                mapEl.setAttribute('map-materials', 'jsonData', JSON.stringify(mapJSON));
              }
              break;
            case error.UNKNOWN_ERROR:
              UpdateGeoPanel("An unknown error occurred.");
              break;
          }
      };
    } else {
      //////////////////////////// this is for iplookup
      if (ipLookupData != null) { 
        console.log("iplookup mode");
        let currentLocString = "Location 0 - You Are Here (via ip)<br>";
        UpdateGeoPanel(currentLocString);
        let mostDistant = 0;
        currentLocation = [ipLookupData.longitude, ipLookupData.latitude]; 
        SetYouAreHereMarker();
        for (var i = 0; i < gpsElements[i].length; i++) {
          for (let name of gpsElements[i].getAttributeNames()) {
            let value = gpsElements[i].getAttribute(name);
            console.log(name, value);
          }
          index++; //zero index is used for player position in mapURL below
          let fromToValues = {};
          fromToValues.from = {};
          fromToValues.to = {};
          fromToValues.from.latitude = ipLookupData.latitude;
          fromToValues.from.longitude = ipLookupData.longitude;
          console.log("geoEntity.toString() is " + geoEntity.toString());
          fromToValues.to.latitude = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
          fromToValues.to.longitude = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
          fromToValues.formula = geolocator.DistanceFormula.HAVERSINE;
          fromToValues.unitSystem = geolocator.UnitSystem.METRIC;

          var distance = geolocator.calcDistance(fromToValues);
          if (distance > mostDistant) {
            mostDistant = distance;
          }

          currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>Location "+index +"</button> distance: " +distance.toFixed(3)+ " miles<br>";
          markers = markers + "&markers=color:red%7Clabel:"+index+"%7C" + gpsElements[i].getAttribute(geoEntity.toString()).latitude+ "," + gpsElements[i].getAttribute(geoEntity.toString()).longitude;
          // console.log(markers);
          let gpsThing = {};
          gpsThing.currentLatitude = location.coords.latitude;
          gpsThing.currentLongitude = location.coords.longitude;
          gpsThing.latitude = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
          gpsThing.longitude = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
          gpsThing.index = index;
          gpsThing.mapURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + gpsThing.latitude + "," + gpsThing.longitude + 
          "&zoom=15&size=2048x2048&maptype=hybrid&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:red%7Clabel:"+index+"%7C" + gpsThing.latitude + "," + gpsThing.longitude;
          // gps.data.push(gpsThing);
          if (mode != 'mapbox') {
            let gpsPanel = document.createElement("a-entity");
            gpsElements[i].appendChild(gpsPanel);
            gpsPanel.setAttribute('poi-map-materials', 'jsonData', JSON.stringify(gpsThing));
            // let pos = gpsElements[i].getAttribute('position').x + " " + (gpsElements[i].getAttribute('position').y + 3) + " " + gpsElements[i].getAttribute('position').z;
            // gpsPanel.setAttribute('position', gpsElements[i].getAttribute('position'));
            gpsPanel.setAttribute('look-at', '#player');
          } else {
            UpdateMarkers();
            SetYouAreHereMarker();
          }
        }
        UpdateGeoPanel(currentLocString);
        let mapEl = document.getElementById('youAreHere');
        mapJSON = {};
        mapJSON.mapURL = "https://maps.googleapis.com/maps/api/staticmap?center=" + location.coords.latitude + "," + location.coords.longitude + // shows everhthing, need to scale zoom by max distance
        "&zoom="+ReturnMapZoom(mostDistant)+"&size=2048x2048&maptype=hybrid&key=AIzaSyCBlNNHgDBmv-vusmuvG3ylf0XjGoMkkCo&markers=color:green%7Clabel:0%7C" + location.coords.latitude + "," + location.coords.longitude + markers;
        mapEl.setAttribute('map-materials', 'jsonData', JSON.stringify(mapJSON));
        // $(".map-overlay").css('visibility','visible');
        // $(".map-overlay").backstretch(mapURL);
      }
    }
    if (theModal == null) {
      theModal = document.getElementById('theModal');
    }

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
  let dragPanEnabled = true;

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

  function ToggleDragPan () {
   
    if (theMap != null) {
      console.log("tryna ToggleDragPan" + dragPanEnabled);
    if (dragPanEnabled) {
      theMap.dragPan.disable();
      dragPanEnabled = false;
    } else {
      // theMap.setPitchBearing(0,90);
      theMap.easeTo({
        pitch:0
      });
      map.dragPan.enable({
        linearity: 0.3,
        // easing: bezier(0, 0, 0.3, 1),
        maxSpeed: 3,
        deceleration: 1.5,
        });
        dragPanEnabled = true;
      }
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
    let eventData = "";
    for (let i = 0; i < gpsElements.length; i++) {
      
      index++; 
        // create a HTML element for each feature
      // var el = document.createElement('div');
      // el.className = 'marker';
      let lat = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
      let lng = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
      let eventData = "";
      let label = "";

      if (sceneLocations != undefined && sceneLocations.locations != undefined) {
        for (let m = 0; m < sceneLocations.locations.length; m++) {
          if (gpsElements[i].getAttribute(geoEntity.toString())._id == sceneLocations.locations[m].timestamp) {//match the timestamp to get the sceneLcoation data
            // console.log("gotsa match " + sceneLocations.locations[m].eventData);
            // label = sceneLocations.locations[m].label != undefined ? sceneLocations.locations[m].label : sceneLocations.locations[m].name; //whatever
            label = sceneLocations.locations[m].name;
            if (sceneLocations.locations[m].markerType == "poi" ) {
              isPoi = true;
            }
            if (sceneLocations.locations[m].eventData != undefined && sceneLocations.locations[m].eventData != null) {
              eventData = sceneLocations.locations[m].eventData;
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
        let latlngStringPrevious = gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude;
        let latlngStringNext = gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude;

        let href = "";
            if (eventData != "" && eventData.includes("link")) {
              let splitchar = null;
              if (eventData.includes("=")) {
                splitchar = "=";
              }
              if (eventData.includes("~")) {
                splitchar = "~";
              }
              if (splitchar != null) {
                let split = eventData.split(splitchar);
                href = split[1].trim();
                
              }
            }

        currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>"+ label + " "+distance.toFixed(2)+ " miles</button><br>";
        // console.log("index " + i + " plusONe " + indexPlusOne +  " minus " + indexMinusOne);
        var popup = new mapboxgl.Popup({className: "mode1-popup"})
        // .setText("loc " + (i + 1).toString() + ": " + label) //zero = you are here

        // .setHTML('<h4>' + (i + 1).toString() + ' ' + label + 
        .setHTML('<h4>' + label + 
        '<br>distance: '+distance.toFixed(2)+' miles</h4>'+
        '<div id=\x22'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude+'\x22 onclick=\x22PopupNextPreviousButtons(\x27'+latlngStringNext+'\x27)\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-arrow-circle-right fa-2x\x22></i><span class=\x22tooltiptext\x22>Next Location</span></div>'+
        
        // '</h4><div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>'+
        // '<div id=\x22'+gpsElements[i].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[i].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-bullseye fa-2x\x22></i><span class=\x22tooltiptext\x22>Center</span></div>'+
        '<div onclick=\x22PopupLinkButtons(\x27'+href+'\x27)\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-link fa-2x\x22></i><span class=\x22tooltiptext\x22>Link</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-envelope fa-2x\x22></i><span class=\x22tooltiptext\x22>Messages</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-camera fa-2x\x22></i><span class=\x22tooltiptext\x22>Pictures</span></div>'+
        // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-walking fa-2x\x22></i><span class=\x22tooltiptext\x22>Directions</span></div>'+
        '</h4><div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+'\x22 onclick=\x22PopupNextPreviousButtons(\x27'+latlngStringPrevious+'\x27)\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>')
        
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

      // console.log("SOCKETID IS  " + socket.id);
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
        var popup = new mapboxgl.Popup({className: "mode1-popup"})
        
        .setHTML('<h4>' + un + ' - you are here' +
        '</h4>'+
        // '<div id=\x22'+currentLocation[0]+'_'+currentLocation[1]+'\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-bullseye fa-2x\x22></i><span class=\x22tooltiptext\x22>Center</span></div>'+
        '<div class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-link fa-2x\x22></i><span class=\x22tooltiptext\x22>Link</span></div>')
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
    // ShowHideGeoPanel();
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

  AFRAME.registerComponent('location_init_mapbox_nope', { //nope, do this in noaframe for now... //nope, just rem threebox, as below
    schema: {
      latitude: {default: 0},
      longitude: {default: 0},
      restrict: {default: false},
      range: {default: .1},
      doBuildings: {default: false},
      doTerrain: {default: false},
      zoomLevel: {default: 19},
      mbid: {default: ""}
      },
    init: function () {
      mode = 'mapbox';
      window.sceneType = mode;
      InitSceneHooks();
      UpdateLocationInfo();
      mapboxgl.accessToken = this.data.mbid;
      // console.log("tryna mapbox with toik,e mn " + mapbox_config.accessToken);
      gpsElements = document.querySelectorAll(".geopoi,.geo");
      let latitude = gpsElements[0].getAttribute(geoEntity.toString()).latitude;
      let longitude = gpsElements[0].getAttribute(geoEntity.toString()).longitude;
      // console.log("lat " )
      var map = new mapboxgl.Map({
        // style: 'mapbox://styles/mapbox/light-v10',
        // style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
        // style: 'mapbox://styles/polytropoi/ckke5tnp40mrt17ohfhkxy29q',
        
        container: 'map',
        zoom: this.data.zoomLevel,
        center: [longitude, latitude],
        pitch: 75,
        bearing: 90,
        antialias: true


        });
        map.scrollZoom.disable();
        theMap = map;

        // window.tb = new Threebox(
        //   map,
        //   map.getCanvas().getContext('webgl'),
        //   {
        //     defaultLights: true,
        //   }
        // );
        window.tb = new Threebox(
          map,
          map.getCanvas().getContext('webgl'),
          {
            defaultLights: true,
            // enableSelectingObjects: true, //change this to false to disable 3D objects selection
            // enableDraggingObjects: true, //change this to false to disable 3D objects drag & move once selected
            // enableRotatingObjects: true, //change this to false to disable 3D objects rotation once selected
            // enableTooltips: true // change this to false to disable default tooltips on fill-extrusion and 3D models
          }
        );
        // let stats;
        // import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
        // function animate() {
        //   requestAnimationFrame(animate);
        //   stats.update();
        // }
        doBuildings = this.data.doBuildings;
        doTerrain = this.data.doTerrain;

        let that = this;
        console.log("do builtings " + doBuildings + " do terrain " + doTerrain);
        map.on('load', function () {
          map.setConfigProperty('basemap', 'lightPreset', 'dusk');
          // map.addControl(
          //   new MapboxDirections({
          //   accessToken: mapboxgl.accessToken
          //   }),
          //   'top-right'
          //   );
          if (doTerrain) {
            map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 20
            });

              // add the DEM source as a terrain layer with exaggerated height
              
            // }
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.25 });
          }
          // add a sky layer that will show when the map is highly pitched
            // map.addLayer({
            //   'id': 'sky',
            //   'type': 'sky',
            //   'paint': {
            //   'sky-type': 'atmosphere',
            //   'sky-atmosphere-sun': [0.0, 0.0],
            //   'sky-atmosphere-sun-intensity': 15
            //   }
            // });

          // map.addLayer({
          //   id: 'custom_layer',
          //   type: 'custom',
          //   renderingMode: '3d',
          //   onAdd: function (map, mbxContext) {
          //     var options = {
          //       obj: 'https://servicemedia.s3.amazonaws.com/assets/models/avatar1c.glb',
          //       type: 'gltf',
          //       scale: 22,
          //       units: 'meters',
          //       rotation: { x: 90, y: 0, z: 0 }, //default rotation
          //       anchor: 'bottom'
          //     }
          //     tb.loadObj(options, function (model) {
          //       let soldier = model.setCoords([longitude, latitude]);
          //       tb.add(soldier);
          //     })
          //   },
          //   render: function (gl, matrix) {
          //   tb.update();
          //   }
          // });
        // rotateCamera(0);
        var layers = map.getStyle().layers;
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
           labelLayerId = layers[i].id;
          break;
          }
        }
        // map.dragPan.enable({
        //   linearity: 0.3,
        //   // easing: bezier(0, 0, 0.3, 1),
        //   maxSpeed: 300,
        //   deceleration: 1500,
        //   });
        map.dragPan.enable({
          linearity: 0.3,
          // easing: bezier(0, 0, 0.3, 1),
          maxSpeed: 3,
          deceleration: 1.5,
          });
        // map.dragPan.disable();
        map.scrollZoom.enable();
        map['doubleClickZoom'].disable();
        map['dragRotate'].enable();
        map.touchPitch.enable();
        map.touchZoomRotate.enable({ around: 'center' });
        // map.scrollZoom.enable({ around: 'center' });
          // if (doBuildings) {
          //   console.log("tryna do buildingz");
          //   map.addLayer({
          //     'id': '3d-buildings',
          //     'source': 'composite',
          //     'source-layer': 'building',
          //     'filter': ['==', 'extrude', 'true'],
          //     'type': 'fill-extrusion',
          //     'minzoom': 15,
          //     'paint': {
          //       'fill-extrusion-color': '#aaa',
                
          //       // use an 'interpolate' expression to add a smooth transition effect to the
          //       // buildings as the user zooms in
          //       'fill-extrusion-height': [
          //       'interpolate',
          //       ['linear'],
          //       ['zoom'],
          //       15,
          //       0,
          //       15.05,
          //       ['get', 'height']
          //       ],
          //       'fill-extrusion-base': [
          //       'interpolate',
          //       ['linear'],
          //       ['zoom'],
          //       15,
          //       0,
          //       15.05,
          //       ['get', 'min_height']
          //       ],
          //       'fill-extrusion-opacity': 0.6
          //       } 
          //     },
          //     labelLayerId
          //   );
          // }
        let currentLocString = "<button class=\x22locbutton\x22 id=\x22"+currentLocation[0]+"_"+currentLocation[1]+"\x22>You are here</button><br><br>";
        // console.log(currentLocString);
        let index = 0; 
        for (let i = 0; i < gpsElements.length; i++) {
          
          console.log("gpsElements: " + gpsElements.length);
          index++; 
            // create a HTML element for each feature
          // var el = document.createElement('div');
          // el.className = 'marker';
          let lat = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
          let lng = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
          // let eventdata = "";
          let label = "";
          let scale = 10;
          let eventData = null;
          if (sceneLocations.locations != undefined) {
            for (let m = 0; m < sceneLocations.locations.length; m++) {
              if (gpsElements[i].getAttribute(geoEntity.toString())._id == sceneLocations.locations[m].timestamp) {//match the id to get the sceneLcoation data
                let modelUrl = 'https://servicemedia.s3.amazonaws.com/assets/models/avatar1c.glb';
                if (sceneLocations.locations[m].modelID != null) {
                  // console.log("Looking for model id: " + sceneLocations.locations[m].modelID);   

                  let locationModel = document.getElementById(sceneLocations.locations[m].modelID.toString());               
                  console.log("Looking for model : " + locationModel.getAttribute('src'));
                  modelUrl = locationModel.getAttribute('src');
                }
                if (sceneLocations.locations[m].markerObjScale != null && sceneLocations.locations[m].markerObjScale != undefined) {
                  scale = parseFloat(sceneLocations.locations[m].markerObjScale);
                  console.log("parsing scale " + scale);
                }

                if (sceneLocations.locations[m].eventData != null && sceneLocations.locations[m].eventData != undefined) {
                  eventData = sceneLocations.locations[m].eventData;
                }
                label = sceneLocations.locations[m].label != undefined ? sceneLocations.locations[m].label : sceneLocations.locations[m].name; // to do : event data
                
                
                // map.on('style.load', function () {
                map.addLayer({
                  id: 'custom_layer'+index.toString(),
                  type: 'custom',
                  renderingMode: '3d',
                  onAdd: function (map, mbxContext) {
                    var options = {
                      obj: modelUrl,
                      type: 'gltf',
                      scale: scale,
                      units: 'meters',
                      rotation: { x: 90, y: 180, z: 0}, //default rotation
                      anchor: 'bottom'
                    }
                    tb.loadObj(options, function (model) {
                      // if (model != undefined && model != null) {
                      let theModel = model.setCoords([sceneLocations.locations[m].longitude, sceneLocations.locations[m].latitude]);

                      // theModel.addEventListener('ObjectMouseOver', onObjectMouseOver, false);
                      let obj = null;
                      tb.add(theModel);
                      // let modelEntity = document.createElement("a-entity");
                      // modelEntity.setAttribute("mod-model");
                      // modelEntity.setObject3D("Object3D", model);
                      // modelEntity.classList.add("activeObjexRay");
                      // gpsElements[i].appendChild(gpsPanel);
                      // }
                    });
                  },
                  render: function (gl, matrix) {
                  tb.update();
                  }
                });
              // });
              }
            }
          }
          if (gpsElements[i].classList.contains('poi')) { //only show poi markers in list
            var distance = DistanceBetweenTwoCoordinates(currentLocation[1], currentLocation[0], lat, lng);
            // console.log("distance " + distance);
            // if (distance > mostDistant) {
            //   mostDistant = distance;
            // }
            // let latlngString = gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude;
            let indexMinusOne = i > 0 ? i - 1 : gpsElements.length - 1;
            let indexPlusOne = i < gpsElements.length - 1 ? i + 1 : 0;
           
            let latlngStringPrevious = gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude;
            let latlngStringNext = gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude;

            currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>" + label + " "+distance.toFixed(2)+ " miles</button><br>";
            // console.log("gpsElements index " + i + " " + currentLocString);
            let href = "";
            if (eventData != null && eventData != "" && eventData.toString().includes("link")) {
              console.log("gotsa link " +eventData);
              let splitchar = null;
              if (eventData.toString().includes("=")) {
                splitchar = "=";
              }
              if (eventData.toString().includes("~")) {
                splitchar = "~";
              }
              if (splitchar != null) {
                let split = eventData.toString().split(splitchar);
                href = split[1].trim();
                
              }
            }
            if (gpsElements[i].classList.contains("poi")) {
              var popup = new mapboxgl.Popup( {className: "mode1-popup"})
              .setHTML('<h4>' + label + 
              '<br>distance: '+distance.toFixed(2)+' miles</h4>'+
              '<div id=\x22'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude+'\x22'+
              'class=\x22locbutton tooltip\x22 onclick=\x22PopupNextPreviousButtons(\x27'+latlngStringNext+'\x27)\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-arrow-circle-right fa-2x\x22></i><span class=\x22tooltiptext\x22>Next Location</span></div>'+
              
              // '<div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>'+
              // // id=\x22'+gpsElements[i].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[i].getAttribute(geoEntity.toString()).latitude+'\x22 
              // '<div id=\x22'+gpsElements[i].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[i].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-bullseye fa-2x\x22></i><span class=\x22tooltiptext\x22>Center</span></div>'+
              '<div onclick=\x22PopupLinkButtons(\x27'+href+'\x27)\x22 class=\x22locbutton tooltip\x22><i style=\x22 margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-link fa-2x\x22></i><span class=\x22tooltiptext\x22>Link</span></div>'+
              // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-envelope fa-2x\x22></i><span class=\x22tooltiptext\x22>Messages</span></div>'+
              // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-camera fa-2x\x22></i><span class=\x22tooltiptext\x22>Pictures</span></div>'+
              // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-walking fa-2x\x22></i><span class=\x22tooltiptext\x22>Directions</span></div>'+
              // '<div id=\x22'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude+'\x22'+
              // 'class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-arrow-circle-right fa-2x\x22></i><span class=\x22tooltiptext\x22>Next Location</span></div>'
              '<div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+
              '\x22 class=\x22locbutton tooltip\x22 onclick=\x22PopupNextPreviousButtons(\x27'+latlngStringPrevious+'\x27)\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>')
              .addTo(theMap);


            let marker = new mapboxgl
              .Marker()
                .setLngLat([gpsElements[i].getAttribute(geoEntity.toString()).longitude, gpsElements[i].getAttribute(geoEntity.toString()).latitude])
                .addTo(map)
                .setPopup(popup);
              popup.remove();  
            }
          // HideMarkers();
        }
      }

        
        UpdateGeoPanel(currentLocString);
        initialized = true;
        // RotateCamera(0);
        // map.on('moveend', function(e){
        //   if(flying) {
        //     // var tooltip = new mapboxgl.Popup()
        //     //   .setLngLat(map.getCenter())
        //     //   .setHTML('<h1>Hello World!</h1>')
        //     //   .addTo(map);
        //     map.fire('flyend');
        //   }
        // });
        map.on('flystart', function(){
          flying = true;
        });
        map.on('flyend', function(){
          flying = false;
        });
        map.on('click', function(e) {
          if (rotator != null) {
            cancelAnimationFrame(rotator); //stop rotation on click if needed
            // rotateOn = false;
          }
        });
        let mapStyle = document.getElementById('mapStyle');
        console.log(mapStyle)
        if (mapStyle != null) {
          console.log(mapStyle.value);

        // map['touchZoomRotate'].enable();
        
        mapStyle.addEventListener('change', (event) => {
          // MapStyleSelectChange(event.target.value);
        });

          // mapStyle.addEventListener("change", MapStyleSelectChange(mapStyle.value));
        }
        // UpdateMarkers();
      }); //map load end

      // UpdateGeoPanel(currentLocString);

      
      }
  });


  AFRAME.registerComponent('location_init_mapbox', { //ok, no threebox...
    schema: {
      latitude: {default: 0},
      longitude: {default: 0},
      restrict: {default: false},
      range: {default: .1},
      doBuildings: {default: false},
      doTerrain: {default: false},
      zoomLevel: {default: 19},
      mbid: {default: ""}
      },
    init: function () {
      mode = 'mapbox';
      window.sceneType = mode;
      // InitSceneHooks();
      UpdateLocationInfo();
      mapboxgl.accessToken = this.data.mbid;
      // console.log("tryna mapbox with toik,e mn " + mapbox_config.accessToken);
      gpsElements = document.querySelectorAll(".geopoi,.geo");
      if (gpsElements.length > 0) {
      let latitude = gpsElements[0].getAttribute(geoEntity.toString()).latitude;
      let longitude = gpsElements[0].getAttribute(geoEntity.toString()).longitude;
      // console.log("lat " )
      var map = new mapboxgl.Map({
        // style: 'mapbox://styles/mapbox/light-v10',
        // style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
        // style: 'mapbox://styles/polytropoi/ckke5tnp40mrt17ohfhkxy29q',
        
        container: 'map',
        zoom: this.data.zoomLevel,
        center: [longitude, latitude],
        pitch: 75,
        bearing: 90,
        antialias: true


        });
        map.scrollZoom.enable();
        theMap = map;

       
        // window.tb = new Threebox(
        //   map,
        //   map.getCanvas().getContext('webgl'),
        //   {
        //     defaultLights: true,

        //   }
        // );

        doBuildings = this.data.doBuildings;
        doTerrain = this.data.doTerrain;

        let that = this;
        console.log("do builtings " + doBuildings + " do terrain " + doTerrain);
        map.on('load', function () {
          // map.addControl(
          //   new MapboxDirections({
          //   accessToken: mapboxgl.accessToken
          //   }),
          //   'top-right'
          //   );

          if (doTerrain) {
            map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 20
            });

              // add the DEM source as a terrain layer with exaggerated height
              
            // }
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.25 });
          }
          // add a sky layer that will show when the map is highly pitched
          // map.addLayer({
          //   'id': 'sky',
          //   'type': 'sky',
          //   'paint': {
          //   'sky-type': 'atmosphere',
          //   'sky-atmosphere-sun': [0.0, 0.0],
          //   'sky-atmosphere-sun-intensity': 15
          //   }
          // });

     
        var layers = map.getStyle().layers;
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
           labelLayerId = layers[i].id;
          break;
          }
        }
        map.dragPan.enable({
          linearity: 0.3,
          // easing: bezier(0, 0, 0.3, 1),
          maxSpeed: 3,
          deceleration: 1.5,
          });
                // map.dragPan.disable();
                map.scrollZoom.enable();
                // map['doubleClickZoom'].disable();
        map['dragRotate'].enable();
        map.touchPitch.enable();
        map.touchZoomRotate.enable({ around: 'center' });
        // map.on('style.load', () => {
          map.setConfigProperty('basemap', 'lightPreset', 'dusk');
      // });
        map.on('mousemove', (e) => {
          // document.getElementById('info').innerHTML =
          // // `e.point` is the x, y coordinates of the `mousemove` event
          // // relative to the top-left corner of the map.
          // JSON.stringify(e.point) +
          // '<br />' +
          // `e.lngLat` is the longitude, latitude geographical position of the event.
          console.log(JSON.stringify(e.lngLat.wrap()));
          });
        // map.scrollZoom.enable({ around: 'center' });
            // if (doBuildings) {
            //   console.log("tryna do buildingz");
            //   map.addLayer({
            //     'id': '3d-buildings',
            //     'source': 'composite',
            //     'source-layer': 'building',
            //     'filter': ['==', 'extrude', 'true'],
            //     'type': 'fill-extrusion',
            //     'minzoom': 15,
            //     'paint': {
            //       'fill-extrusion-color': '#aaa',
                  
            //       // use an 'interpolate' expression to add a smooth transition effect to the
            //       // buildings as the user zooms in
            //       'fill-extrusion-height': [
            //       'interpolate',
            //       ['linear'],
            //       ['zoom'],
            //       15,
            //       0,
            //       15.05,
            //       ['get', 'height']
            //       ],
            //       'fill-extrusion-base': [
            //       'interpolate',
            //       ['linear'],
            //       ['zoom'],
            //       15,
            //       0,
            //       15.05,
            //       ['get', 'min_height']
            //       ],
            //       'fill-extrusion-opacity': 0.6
            //       } 
            //     },
            //     labelLayerId
            //   );
            // }
        let currentLocString = "<button class=\x22locbutton\x22 id=\x22"+currentLocation[0]+"_"+currentLocation[1]+"\x22>You are here</button><br><br>";
        // console.log(currentLocString);
        let index = 0; 
        for (let i = 0; i < gpsElements.length; i++) {
          
          console.log("gpsElements: " + gpsElements.length);
          index++; 
            // create a HTML element for each feature
          // var el = document.createElement('div');
          // el.className = 'marker';
          let lat = gpsElements[i].getAttribute(geoEntity.toString()).latitude;
          let lng = gpsElements[i].getAttribute(geoEntity.toString()).longitude;
          // let eventdata = "";
          let label = "";
          let scale = 10;
          let eventData = null;
          if (sceneLocations.locations != undefined) {
            for (let m = 0; m < sceneLocations.locations.length; m++) {
              if (gpsElements[i].getAttribute(geoEntity.toString())._id == sceneLocations.locations[m].timestamp) { //match the id to get the sceneLcoation data
                let modelUrl = 'https://servicemedia.s3.amazonaws.com/assets/models/avatar1c.glb';
                if (sceneLocations.locations[m].modelID != null) {
                  console.log("Looking for model id: " + sceneLocations.locations[m].modelID);   

                  let locationModel = document.getElementById(sceneLocations.locations[m].modelID.toString());               
                  // console.log("Looking for model : " + locationModel.getAttribute('src'));
                  if (locationModel) {
                    modelUrl = locationModel.getAttribute('src');
                  }
                  
                }
                if (sceneLocations.locations[m].markerObjScale != null && sceneLocations.locations[m].markerObjScale != undefined) {
                  scale = parseFloat(sceneLocations.locations[m].markerObjScale);
                  console.log("parsing scale " + scale);
                }

                if (sceneLocations.locations[m].eventData != null && sceneLocations.locations[m].eventData != undefined) {
                  eventData = sceneLocations.locations[m].eventData;
                }
                label = sceneLocations.locations[m].label != undefined ? sceneLocations.locations[m].label : sceneLocations.locations[m].name; // to do : event data
                      //maybe this inside the map.addLayer below...
                            // let modelEntity = document.createElement("a-entity");
                            //     modelEntity.setAttribute('gltf-model', modelUrl);
                                
                            //     sceneEl.appendChild(modelEntity);
                            //     const convertedLocation = mapboxgl.MercatorCoordinate.fromLngLat({
                            //       lng: sceneLocations.locations[m].longitude,
                            //       lat: sceneLocations.locations[m].latitude,
                            //       });
                            //     console.log("tryna set model " + modelUrl + " at " + JSON.stringify(convertedLocation));
                            //     modelEntity.setAttribute('position', convertedLocation);


                    // modelEntity.setAttribute('scale', 100, 100, 100);

                    // gpsElements[i].appendChild(gpsPanel);

                /*
                map.addLayer({
                  id: 'custom_layer'+index.toString(),
                  type: 'custom',
                  renderingMode: '3d',
                  onAdd: function (map, mbxContext) {
                    var options = {
                      obj: modelUrl,
                      type: 'gltf',
                      scale: scale,
                      units: 'meters',
                      rotation: { x: 90, y: 180, z: 0}, //default rotation
                      anchor: 'bottom'
                    }
                    tb.loadObj(options, function (model) {
                      // if (model != undefined && model != null) {
                      let theModel = model.setCoords([sceneLocations.locations[m].longitude, sceneLocations.locations[m].latitude]);

                      // theModel.addEventListener('ObjectMouseOver', onObjectMouseOver, false);
                      let obj = null;
                      tb.add(theModel);
                      // let modelEntity = document.createElement("a-entity");
                      // modelEntity.setAttribute("mod-model");
                      // modelEntity.setObject3D("Object3D", model);
                      // modelEntity.classList.add("activeObjexRay");
                      // gpsElements[i].appendChild(gpsPanel);
                      // }
                    });
                  },
                  render: function (gl, matrix) {
                  tb.update();
                  }
                });
                */
              }
            }
          }
          if (gpsElements[i].classList.contains('poi')) { //only show poi markers in list
            var distance = DistanceBetweenTwoCoordinates(currentLocation[1], currentLocation[0], lat, lng);
            // console.log("distance " + distance);
            // if (distance > mostDistant) {
            //   mostDistant = distance;
            // }
            // let latlngString = gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude;
            let indexMinusOne = i > 0 ? i - 1 : gpsElements.length - 1;
            let indexPlusOne = i < gpsElements.length - 1 ? i + 1 : 0;
           
            let latlngStringPrevious = gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude;
            let latlngStringNext = gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude;

            currentLocString = currentLocString + "\n<button class=\x22locbutton\x22 id=\x22"+gpsElements[i].getAttribute(geoEntity.toString()).longitude+"_"+gpsElements[i].getAttribute(geoEntity.toString()).latitude+"\x22>" + label + " "+distance.toFixed(2)+ " miles</button><br>";
            // console.log("gpsElements index " + i + " " + currentLocString);
            let href = "";
            if (eventData != null && eventData != "" && eventData.toString().includes("link")) {
              console.log("gotsa link " +eventData);
              let splitchar = null;
              if (eventData.toString().includes("=")) {
                splitchar = "=";
              }
              if (eventData.toString().includes("~")) {
                splitchar = "~";
              }
              if (splitchar != null) {
                let split = eventData.toString().split(splitchar);
                href = split[1].trim();
                
              }
            }
            if (gpsElements[i].classList.contains("poi")) {
              var popup = new mapboxgl.Popup( {className: "mode1-popup"})
              .setHTML('<h4>' + label + 
              '<br>distance: '+distance.toFixed(2)+' miles</h4>'+
              '<div id=\x22'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude+'\x22'+
              'class=\x22locbutton tooltip\x22 onclick=\x22PopupNextPreviousButtons(\x27'+latlngStringNext+'\x27)\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-arrow-circle-right fa-2x\x22></i><span class=\x22tooltiptext\x22>Next Location</span></div>'+
              
              // '<div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>'+
              // // id=\x22'+gpsElements[i].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[i].getAttribute(geoEntity.toString()).latitude+'\x22 
              // '<div id=\x22'+gpsElements[i].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[i].getAttribute(geoEntity.toString()).latitude+'\x22 class=\x22locbutton tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-bullseye fa-2x\x22></i><span class=\x22tooltiptext\x22>Center</span></div>'+
              '<div onclick=\x22PopupLinkButtons(\x27'+href+'\x27)\x22 class=\x22locbutton tooltip\x22><i style=\x22 margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-link fa-2x\x22></i><span class=\x22tooltiptext\x22>Link</span></div>'+
              // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-envelope fa-2x\x22></i><span class=\x22tooltiptext\x22>Messages</span></div>'+
              // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-camera fa-2x\x22></i><span class=\x22tooltiptext\x22>Pictures</span></div>'+
              // '<div class=\x22tooltip\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-walking fa-2x\x22></i><span class=\x22tooltiptext\x22>Directions</span></div>'+
              // '<div id=\x22'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexPlusOne].getAttribute(geoEntity.toString()).latitude+'\x22'+
              // 'class=\x22locbutton tooltip\x22><i  style=\x22margin-left: 10px; margin-right: 10px;\x22class=\x22fas fa-arrow-circle-right fa-2x\x22></i><span class=\x22tooltiptext\x22>Next Location</span></div>'
              '<div id=\x22'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).longitude+'_'+gpsElements[indexMinusOne].getAttribute(geoEntity.toString()).latitude+
              '\x22 class=\x22locbutton tooltip\x22 onclick=\x22PopupNextPreviousButtons(\x27'+latlngStringPrevious+'\x27)\x22><i style=\x22margin-left: 10px; margin-right: 10px;\x22 class=\x22fas fa-arrow-circle-left fa-2x\x22></i><span class=\x22tooltiptext\x22>Previous Location</span></div>')
              .addTo(theMap);

              
            let marker = new mapboxgl
              .Marker()
                .setLngLat([gpsElements[i].getAttribute(geoEntity.toString()).longitude, gpsElements[i].getAttribute(geoEntity.toString()).latitude])
                .addTo(map)
                .setPopup(popup);
              popup.remove();  
            }
          // HideMarkers();
        }
      }

        
        UpdateGeoPanel(currentLocString);
        initialized = true;

        map.on('flystart', function(){
          flying = true;
        });
        map.on('flyend', function(){
          flying = false;
        });
        map.on('click', function(e) {
          if (rotator != null) {
            cancelAnimationFrame(rotator); //stop rotation on click if needed
            // rotateOn = false;
          }
        });

            // let mapStyle = document.getElementById('mapStyle');
            // console.log(mapStyle)
            // if (mapStyle != null) {
            //   console.log(mapStyle.value);

            // // map['touchZoomRotate'].enable();
            
            //   mapStyle.addEventListener('change', (event) => {
            //     // MapStyleSelectChange(event.target.value);
            //   });

            //   // mapStyle.addEventListener("change", MapStyleSelectChange(mapStyle.value));
            // }
        // UpdateMarkers();
      }); //map load end

      // UpdateGeoPanel(currentLocString);
      
      }//gpsElements is empty
    
    }
  }); // end mapbox init