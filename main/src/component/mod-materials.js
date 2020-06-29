//sniff user agent - is this safari on ios? 
var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

AFRAME.registerComponent('mod-materials', {
  schema: {
    // url: {default: ''},
    index: {default: ''}
    },
    init: function () {
      let data = this.data;
      if (data.index != null) {
      this.el.addEventListener('model-loaded', () => {
        // Grab the mesh / scene.
        const obj = this.el.getObject3D('mesh');
        const ref = document.querySelector("#smimage"+data.index);
        console.log("tryna set texture..." + ref.src);

        var texture = new THREE.TextureLoader().load(ref.src);
        texture.encoding = THREE.sRGBEncoding; 
        // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
        texture.flipY = false; 
        // immediately use the texture for material creation
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        // Go over the submeshes and modify materials we want.
        obj.traverse(node => {
        //   if (node.name.indexOf('ship') !== -1) {
            // node.material.color.set('red');
            node.material = material;
          //   }
          });
        });
      }
    }
  });
  AFRAME.registerComponent('vid-materials', {
    schema: {
      url: {default: ''},
      index: {default: ''}
      },
      init: function () {
        // this.isPlaying = false;
        console.log("ua is " + ua);
        this.onClick = this.onClick.bind(this);
        let data = this.data;
        if (data.index != null) {
        this.el.addEventListener('model-loaded', () => {
          // Grab the mesh / scene.
          const obj = this.el.getObject3D('mesh');
          let video = document.querySelector("#video1"); //naw, better to just pass in a url and assign it, rather than load vids into aframe asset mangler
          console.log("video element: " + JSON.stringify(video));
          // let video = {};
          // 
          if (this.data.url != '') {
            video.src = this.data.url; //if src is missing from element, it's not preloaded so populate with schema value for "streaming"
          }
          
          // video.play();
          // video.load();
          console.log("tryna set texture..." + video.src);
          
          var texture = new THREE.VideoTexture( video );
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBFormat;
          // video.encoding = THREE.sRGBEncoding; 
          // // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
          texture.flipY = false; 
          // immediately use the texture for material creation
          var material = new THREE.MeshBasicMaterial( { map: texture } ); 
          // Go over the submeshes and modify materials we want.
          obj.traverse(node => {
          //   if (node.name.indexOf('ship') !== -1) {
              // node.material.color.set('red');
              node.material = material;
            //   }
          });
          
            // video.load();
            // video.play();
          this.isPlaying = false;
          
          this.video = video;

          });

        }
        document.querySelector("#videoText").setAttribute('text', {
          baseline: "bottom",
          align: "left",
            value: "Click to Play"
        });
      },
      play: function () {
          // if (!iOS) {
          //   this.el.addEventListener('click', this.onClick); // Not Safari can click the object
          // } else {
          //   console.log("mobile safari!");
          //   window.addEventListener('click', this.onClick); // Safari (and Chrome on iOS?) needs to click window
          // }
        this.el.addEventListener('click', this.onClick);
        
        // console.log("tryna play");
        // this.isPlaying = false; //dangit, always resets to true
       
      },
      pause: function () {
        this.el.removeEventListener('click', this.onClick);
      },
      onClick: function (evt) {
        
        if (!this.video) { return; }
        console.log("isPlaying " + this.isPlaying);
        if (!this.isPlaying) {
          console.log("tryna play!");
          this.video.play();
          this.isPlaying = true;
          document.querySelector("#videoText").setAttribute('text', {
            baseline: "bottom",
            align: "left",
            color: "green",
            value: "Playing"
        });

        } else {
          console.log("tryna pauyse!");
          this.video.pause();
          this.isPlaying = false;
            document.querySelector("#videoText").setAttribute('text', {
              baseline: "bottom",
              align: "left",
              color: "red",
              value: "Paused"
          });

        }
      }
    });

    AFRAME.registerComponent('zplay-on-click', { //for videosphere, move this to utils later

      init: function () {
        this.isPlaying = false;
        this.onClick = this.onClick.bind(this);
        // var video = this.el.components.material.material.map.image;
        // if (!video) { return; }
        // video.play();
      },
      play: function () {
        this.el.addEventListener('click', this.onClick);
        console.log("tryna play");
      },
      pause: function () {
        this.el.removeEventListener('click', this.onClick);
      },
      onClick: function (evt) {
        
        var video;
        this.el.addEventListener('model-loaded', () => {
          // Grab the mesh / scene.
        const obj = this.el.getObject3D('mesh');
        obj.traverse(node => {
    
          video = node.material.map.image;
              
          });
        });
        if (!video) { return; }
        if (!this.isPlaying) {
          console.log("tryna play!");
        video.play();
        this.isPlaying = true;
        } else {
          console.log("tryna pauyse!");
          video.pause();
          this.isPlaying = false;
        }
      }
    });