
    //link
    AFRAME.registerComponent('link', {
        schema: {default: ''},
  
        init: function () {
          var url = this.data;
          this.el.addEventListener('click', function () {
            window.location.href = url;
          });
        }
      });
      
      // Component to change to random color on click.
      AFRAME.registerComponent('cursor-listener', {
          
          init: function () {
            this.el.addEventListener('click', function (evt) {
              this.emit('zoomIn');
              console.log('I was clicked at: ', evt, evt.detail.intersection.point);
            });
            
          }
      });
      
       //video-listener
      AFRAME.registerComponent('video-listener', {
          
          init: function () {
            
            // Bind methods.
                     this.onIntersection = AFRAME.utils.bind(this.onIntersection, this);
            
            this.el.addEventListener('canplay', function (evt) {
              console.log("video-listener", 'canplay', evt);
            });
            
            this.el.addEventListener('materialvideoloadeddata', function (evt) {
              console.log("video-listener", 'materialvideoloadeddata', evt);
            });
            
            this.el.addEventListener('materialvideoended', function (evt) {
              console.log("video-listener", 'materialvideoended', evt);
            });
            
          },
        
          tick: function (time, timeDelta) {
  
          },
        
          /**
           * this.el is the entity element.
           * this.el.object3D is the three.js object of the entity.
           * this.data is the component's property or properties.
           */
          update: function (oldData) {
            var object3D = this.el.object3D;
            var data = this.data;
          },
        
        
          /* private */
  
          onIntersection: function(){
  
          }
        
      });