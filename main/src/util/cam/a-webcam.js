if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }

AFRAME.registerComponent('a-webcam', {
    
    schema: { },

    constraints : {
      audio: false,
      video: { frameRate: { ideal: 40, max: 60 } }
      },
    
    video: null,
                           
    init: function( ){
   
      var utils = AFRAME.utils;
      
      this.done = utils.bind(this.done, this);
      this.fail = utils.bind(this.fail, this);
      this.ready = utils.bind(this.ready, this);
      this.canplay = utils.bind(this.canplay, this);
      
      navigator
          .mediaDevices
          .getUserMedia(this.constraints)
          .then( this.done)
          .catch(this.fail);
    },
    
    update: function (oldData) {
      
      var data = this.data;
      var el = this.el;
      
      // `pattern property: <property> updated. Remove the previous event listener if it exists.
      /*if (oldData.property && data.property!== oldData.property) {
          el.removeEventListener(oldData.property, this.eventHandlerFn);
      }
      
      if (data.event) {
          el.addEventListener(data.event, this.eventHandlerFn);
      } else {
          console.log(data.message);
      }*/
      
    },

    tick: function (time, timeDelta) {
      //poll conditions, updates
    },

    done: function( stream ){
          
      var data = this.data,
          self = this,
          selector = this.el.components.material.attrValue.src;
      
        this.video = document.querySelector(selector);
      
        this.video.srcObject = stream;
        this.video.addEventListener("canplay",this.canplay);
      
        this.el.addEventListener("materialvideoloadeddata",this.ready);
    },

    canplay: function(e){
      console.log("canplay")
    },

    ready: function(e){
      console.log("material loaded data")
    },
    
    fail: function(err){
      console.log('a-webcam: err', err.message)
    }
    
   });