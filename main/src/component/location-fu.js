
//  window.onload = () => { navigator.geolocation.getCurrentPosition((position) => {
//     console.log("position latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude);
//     document.querySelector('#locationStatus').setAttribute('gps-entity-place', `latitude: ${position.coords.latitude}; longitude: ${position.coords.longitude};`);
//     document.querySelector('#locationStatus').setAttribute('value', "latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude);
//     const distanceMsg = document.querySelector('[gps-entity-place]').getAttribute('distanceMsg');
//     console.log("distance: " + distanceMsg); 
//     document.querySelector('#locationStatus').setAttribute('value', distanceMsg);
//     });
//   }
//   window.onload = () => {
//       GetLocation();
//   }
const locstyle = "position:fixed;display:block;width:200px;height:75px;right:200px;bottom:100px;background-color:#ffffff;z-index:20;"

function UpdateGeoPanel(nwString) {
  let d = document.querySelector('.geopanel');
  d.setAttribute("style",locstyle);
  var p = d.querySelector('p');
  p.setAttribute("style","text-align: center;margin:auto;font-size:12px Roboto;");
  p.innerHTML=nwString;
}

  function GetLocation() {
      console.log("tryna GetLocation");
      // document.querySelector('#locationStatus').setAttribute('value', "Getting location data...");
      UpdateGeoPanel("Getting location data...");
      return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        // dynamicLoadPlaces(position.coords)
        //     .then((places) => {
        //         renderPlaces(places);
        //     })
        // let positionText = "Current Location: " + position.coords.latitude.toFixed(2) + "," + position.coords.longitude.toFixed(2); 
        console.log("position latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude);
        // document.querySelector('#locationStatus').setAttribute('gps-entity-place', `latitude: ${position.coords.latitude}; longitude: ${position.coords.longitude};`);
        // document.querySelector('#locationStatus').setAttribute('value', positionText);
        UpdateGeoPanel("position latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude);
        // let locEntities = document.querySelectorAll('[gps-entity-place]');
        // let loc = document.querySelector('[gps-entity-place]');
        // let distances = "";
        // locEntities.forEach(function(location) {
            // console.log(loc);
            // const loc = location.gps-entity-place.latitude+","+location.gps-entity-place.longitude;
            const gpsEl =  document.querySelector('[gps-entity-place]');
            if (gpsEl != null) {
            const distanceMsg = gpsEl.getAttribute('distanceMsg');
            // distances = loc.latitude+","+loc.longitude+" distance:"+distance;
              console.log("distance: " + distanceMsg); 
            
          // });
          // document.querySelector('#locationStatus').setAttribute('value', distanceMsg);
              UpdateGeoPanel(distanceMsg);
            }
        // document.querySelector('#locationStatus').setAttribute('value', distanceMsg);
    },
        (err) => console.error('Error in retrieving position', err),
        {
            
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
  }

  AFRAME.registerComponent('location-init', { //for videosphere, move this to utils later
    init: function () {
        UpdateGeoPanel("Initializing location services...");
        GetLocation();
    }
  });


// window.onload = () => {
//     let method = 'dynamic';

//     // if you want to statically add places, de-comment following line:
//     // method = 'static';
//     if (method === 'static') {
//         let places = staticLoadPlaces();
//         return renderPlaces(places);
//     }

//     if (method !== 'static') {
//         // first get current user location
//         return navigator.geolocation.getCurrentPosition(function (position) {

//             // than use it to load from remote APIs some places nearby
//             // dynamicLoadPlaces(position.coords)
//             //     .then((places) => {
//             //         renderPlaces(places);
//             //     })
//         },
//             (err) => console.error('Error in retrieving position', err),
//             {
//                 enableHighAccuracy: true,
//                 maximumAge: 0,
//                 timeout: 27000,
//             }
//         );
//     }
// };

// function staticLoadPlaces() {
//     return [
//         {
//             name: "Your place name",
//             location: {
//                 lat: 44.493271, // change here latitude if using static data
//                 lng: 11.326040, // change here longitude if using static data
//             }
//         },
//     ];
// }

// // getting places from REST APIs
// function dynamicLoadPlaces(position) {
//     let params = {
//         radius: 300,    // search places not farther than this value (in meters)
//         clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
//         clientSecret: '',
//         version: '20300101',    // foursquare versioning, required but unuseful for this demo
//     };

//     // CORS Proxy to avoid CORS problems
//     let corsProxy = 'https://cors-anywhere.herokuapp.com/';

//     // Foursquare API
//     let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
//         &ll=${position.latitude},${position.longitude}
//         &radius=${params.radius}
//         &client_id=${params.clientId}
//         &client_secret=${params.clientSecret}
//         &limit=15
//         &v=${params.version}`;
//     return fetch(endpoint)
//         .then((res) => {
//             return res.json()
//                 .then((resp) => {
//                     return resp.response.venues;
//                 })
//         })
//         .catch((err) => {
//             console.error('Error with places API', err);
//         })
// };

// function renderPlaces(places) {
//     let scene = document.querySelector('a-scene');

//     places.forEach((place) => {
//         let latitude = place.location.lat;
//         let longitude = place.location.lng;

//         // add place name
//         let text = document.createElement('a-link');
//         text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
//         text.setAttribute('title', place.name);
//         text.setAttribute('href', 'http://www.example.com/');
//         text.setAttribute('scale', '15 15 15');

//         text.addEventListener('loaded', () => {
//             window.dispatchEvent(new CustomEvent('gps-entity-place-loaded', { detail: { component: this.el }}))
//         });

//         scene.appendChild(text);
//     });
// }
