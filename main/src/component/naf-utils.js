


// AFRAME.registerComponent('playy-on-click', { //for videosphere, move this to utils later
//   init: function () {
//     this.isPlaying = false;
//     this.onClick = this.onClick.bind(this);
//     var video = this.el.components.material.material.map.image;
//     if (!video) { return; }
//     video.play();
//   },
//   play: function () {
//     this.el.addEventListener('click', this.onClick);
//     console.log("tryna play");
//   },
//   pause: function () {
//     this.el.removeEventListener('click', this.onClick);
//   },
//   onClick: function (evt) {
//     var video = this.el.components.material.material.map.image;
//     if (!video) { return; }
//     if (!this.isPlaying) {
      
//     video.play();
//     this.isPlaying = true;
//     } else {
//       video.pause();
//       this.isPlaying = false;
//     }
//   }
// });


      // Define custom schema for syncing avatar color, set by random-color
    let avatarName = document.querySelector(".avatarName").id;

      NAF.schemas.add({
        template: '#avatar-template',
        components: [
          'position',
          'rotation',
          {
            selector: '.playerName',
            component: 'text',
            property: 'value'
          }
        ]
      });
      // Called by Networked-Aframe when connected to server
      function onConnect () {
        console.log("onConnect", new Date());
        document.querySelector("#statusText").setAttribute('text', {
          baseline: "bottom",
          align: "left",
          value: "connected as " + avatarName + "\n" + JSON.stringify(NAF.connection.getConnectedClients())
        });
        document.body.addEventListener('connected', function (evt) {
          console.error('connected event. clientId =', evt.detail.clientId);
        });

        document.body.addEventListener('clientConnected', function (evt) {
          console.error('clientConnected event. clientId =', evt.detail.clientId);
        });

        document.body.addEventListener('clientDisconnected', function (evt) {
          console.error('clientDisconnected event. clientId =', evt.detail.clientId);
        });

        document.body.addEventListener('entityCreated', function (evt) {
          console.error('entityCreated event', evt.detail.el);
        });

        document.body.addEventListener('entityRemoved', function(evt) {
          console.error('entityRemoved event. Entity networkId =', evt.detail.networkId);
        });
      }

      // On mobile remove elements that are resource heavy
      // var isMobile = AFRAME.utils.device.isMobile();

      // if (isMobile) {
      //   var particles = document.getElementById('particles');
      //   particles.parentNode.removeChild(particles);
      // }


      AFRAME.registerComponent('naf-connect', {
        schema: {
          // url: {default: ''},
          avatarName: {default: ''}
          },

          init: function () {
            // AFRAME.scenes[0].emit('connect');
            
          

            // console.log("clients: " + NAF.connection.getConnectedClients());
            if (!NAF.connection.isConnected()) {

              document.querySelector("#statusText").setAttribute('text', {
                  // baseline: "bottom",
                  // align: "left",
                  value: "not connected"
                });
            } else {
              document.querySelector("#statusText").setAttribute('text', {
                  baseline: "bottom",
                  align: "left",
                  value: "connected as " + avatarName + "\n" + JSON.stringify(NAF.connection.getConnectedClients())
                });
            }
            this.el.addEventListener('mouseenter', function () {
              if (!document.querySelector("#statusText").getAttribute('visible')){
                document.querySelector("#statusText").setAttribute('visible', true);
              } else {
                document.querySelector("#statusText").setAttribute('visible', false);
              }
              if (!NAF.connection.isConnected()) {
                AFRAME.scenes[0].emit('connect');
                document.querySelector("#statusText").setAttribute('text', {
                    // baseline: "bottom",
                    // align: "left",
                    value: "not connected"
                  });
              } else {
                // this.el.setAttribute('color', 'green');
                document.querySelector("#statusText").setAttribute('text', {
                    baseline: "bottom",
                    align: "left",
                    value: "connected as " + avatarName + "\n" + JSON.stringify(NAF.connection.getConnectedClients())
                  });
              }
            });
            this.el.addEventListener('mouseleave', function () {

              // document.querySelector("#statusText").setAttribute('visible', false);
              
            });
            // })
            // });
            // // if (!NAF.connection.isConnected()) {
            // AFRAME.scenes[0].emit('connect');
            
            // // this.el.setAttribute('material', 'color', 'green');
            // } else {
            //   AFRAME.scenes[0].removeAttribute('networked-scene');
            //   // this.el.setAttribute('material', 'color', 'red');
            // }
           
          // });
        },
    });
