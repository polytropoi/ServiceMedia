const raycaster = new THREE.Raycaster(); //reuse this!  
const mouse = new THREE.Vector2();
let primaryVideo = null;
// let mainDiv = document.getElementById("mainDiv");
// let videoEl = null;

// let vidzz = document.getElementsByTagName("video"); //vidz declared in content-utils?
//   if (vidz != null && vidz.length > 0) { //either video or audio, not both...?
//     videoEl = vidzz[0];
//     console.log("videoEl " + videoEl.src);
//   }

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
window.addEventListener( 'mousemove', onMouseMove, false ); // whataboutVR?


AFRAME.registerComponent('mod-materials', {
  schema: {
    // url: {default: ''},
    index: {default: ''}
    },
    init: function () {
      let data = this.data;
      if (data.index != null) {
      this.el.addEventListener('model-loaded', () => {
        
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
            node.material = material;
          });
        });
      }
    }
  });

  AFRAME.registerComponent('mod_picture', {
    schema: {
      url: {default: ''}
      // index: {default: ''}
      },
      init: function () {
        let data = this.data;

        this.el.addEventListener('model-loaded', () => {
          console.log("tryna load media w/ url " + this.data.url);
          const obj = this.el.getObject3D('mesh');
          // const ref = document.querySelector("#smimage"+data.index);
          console.log("tryna set texture..." + this.data.url);
  
          var texture = new THREE.TextureLoader().load(this.data.url);
          texture.encoding = THREE.sRGBEncoding; 
          // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
          texture.flipY = false; 
          // immediately use the texture for material creation
          var material = new THREE.MeshBasicMaterial( { map: texture } ); 
          // Go over the submeshes and modify materials we want.
          obj.traverse(node => {
              node.material = material;
            });
          });
        // }
      }
    });

  AFRAME.registerComponent('poi-map-materials', {
    schema: {
      // url: {default: ''},
      // index: {default: ''},
      jsonData: {
        parse: JSON.parse,
        stringify: JSON.stringify
        }
      },
      init: function () {
        // let data = this.data;
        // console.log(this.data.jsonData);
        // if (data.index != null && data.index != '') {
        
        let childPanel = document.createElement("a-entity");
        this.el.appendChild(childPanel);
        childPanel.setAttribute('position', '0 2 0');
        childPanel.setAttribute('gltf-model', '#square_panel');

        childPanel.addEventListener('model-loaded', () => {
        // Grab the mesh / scene.
        const obj = childPanel.getObject3D('mesh');
        // const ref = document.querySelector("#smimage"+data.index);
        console.log("tryna set poi-map texture..." + this.data.jsonData.mapURL);
        var texture = new THREE.TextureLoader().load(this.data.jsonData.mapURL);
        texture.encoding = THREE.sRGBEncoding; 
        // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
        texture.flipY = false; 
        // immediately use the texture for material creation
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        // Go over the submeshes and modify materials we want.
        obj.traverse(node => {
            node.material = material;
        });
      }); 
    }
  });

  AFRAME.registerComponent('map-materials', {
    schema: {
      // url: {default: ''},
      // index: {default: ''},
      jsonData: {
        parse: JSON.parse,
        stringify: JSON.stringify
      }
      },
      init: function () {
        // let data = this.data;
        console.log(JSON.stringify(this.data.jsonData));
        // this.el.setAttribute('position', '0 -1 0');
        // if (data.index != null && data.index != '') {
        this.el.setAttribute('gltf-model', '#square_panel');
        this.el.setAttribute('look-at', '#player');
        // let gpsData = this.data.jsonData.gpsData
            this.el.addEventListener('model-loaded', () => {
              // Grab the mesh / scene.


              const obj = this.el.getObject3D('mesh');
              // const ref = document.querySelector("#smimage"+data.index);

              console.log("tryna set map texture..." + this.data.jsonData.mapURL);
      
              var texture = new THREE.TextureLoader().load(this.data.jsonData.mapURL);
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
        // }
      }
    });
  AFRAME.registerComponent('weblink-materials', {
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
          const ref = document.querySelector("#wlimage"+data.index);
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
  AFRAME.registerComponent('vid_materials', { //mapped on internal geo, if no external mesh assigned// deprecated..?
    schema: {
      url: {default: ''},
      url_webm: {default: ''},
      url_mov: {default: ''},
      index: {default: ''},
      flipY: {default: false}
      },
      init: function () {
        // this.isPlaying = false;
        // console.log("video url is " + JSON.stringify(this.data));
        this.onClick = this.onClick.bind(this);
        let data = this.data;
        if (data.index != null) {
          console.log("tryna load video data " + JSON.stringify(this.data));
          this.el.addEventListener('model-loaded', () => {
            // Grab the mesh / scene.
            const obj = this.el.getObject3D('mesh');
            let video1 = document.querySelector("#video1"); // better to just pass in a url and assign it, rather than load vids into aframe asset mangler
            console.log("video element: " + JSON.stringify(video1));

            if (this.data.url != '') {
              video1.src = this.data.url; //if src is missing from element, it's not preloaded so populate with schema value for "streaming"
            }

            console.log("tryna set video texture: " + video1.src);
            
            var texture = new THREE.VideoTexture( video1 );
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                // if (video1.src.includes(".webm") || video1.src.includes(".mov")) { 
                //   texture.format = THREE.RGBAFormat; //this needs to be a separate property
                //   console.log("tryna set ALPHA VIDEO TEXTURE");

                // } else {
                //   // texture.format = THREE.RGBFormat;
                //   texture.format = THREE.RGBFormat;
                // }
            
            texture.flipY = this.data.flipY; 
            // immediately use the texture for material creation
            var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } ); 

            // Go over the submeshes and modify materials we want.
            obj.traverse(node => {

                node.material = material;
              
            });         
            material.map.needsUpdate = true;   
            this.isPlaying = false;
            this.video = video1;

          });

        }
        if (document.querySelector("#videoText") != null) {
          document.querySelector("#videoText").setAttribute('text', {
            baseline: "bottom",
            align: "left",
              value: "Click to Play"
          });
        }
      },
      play: function () {
        this.el.addEventListener('click', this.onClick);
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
          let vText = document.getElementById("#videoText");
          if (vText) {
            vText.setAttribute('text', {
            baseline: "bottom",
            align: "left",
            color: "green",
            value: "Playing"
            });
          }
        } else {
          console.log("tryna pauyse!");
          this.video.pause();
          this.isPlaying = false;
          let vText = document.getElementById("#videoText");
          if (vText) {
            vText.setAttribute('text', {
            baseline: "bottom",
            align: "left",
            color: "red",
            value: "Paused"
            });
          }

        }
      }
    });

    /////////////////////////////////   functions called by vid_materials_embed below, playing on/with external geometry
    async function playVideo(video) {
      if (video == null) {
        video = primaryVideo;
      }
      console.log("tryna await video...");
      try {
        await video.play();
        console.log("video should be playing...anytimenow");
        
      } catch(err) {
        console.log("video error: " + err);
      }
    }
    function pauseVideo(video) {
      if (video == null) {
        video = primaryVideo;
      }
      if (!video.paused) {
      var playPromise = video.play();
      if (playPromise !== undefined) {
            playPromise.then(_ => {
            
              video.pause();
              // mainDiv.dispatchEvent('primaryVideoToggle', {isPlaying : false}, true);
            })
            .catch(error => {

              console.log("error " +error)
            });
          }
        }
    }

  //////////////////////////// - WEBCAM MATERIALS EMBED (e.g. local mediadevices)
    AFRAME.registerComponent('webcam_materials_embed', { 
      init: function () {

        this.el.classList.add("video_embed");
       console.log("webcam_material_embed init");
        this.loadWebcam();
      },
      loadWebcam: function () {
        navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          if (devices.length) {
            devices.forEach((device) => {
              console.log("webcam device" + `${device.kind}: ${device.label} id = ${device.deviceId}`);
            });
            navigator.mediaDevices.getUserMedia({audio: false, video: true})
            .then(stream => {
              let $video = document.querySelector('video');
              $video.srcObject = stream
              $video.onloadedmetadata = () => {
                $video.play()
                this.loadTexture();        
              }
            })
          } else {
            console.log("no devices found!");
          }
         
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
  
       
      },
      loadTexture: function () {
        this.video = document.getElementById("webcam");  
        this.mesh = this.el.getObject3D('Object3D');
        this.screenMesh = null;
        this.mesh.traverse(node => {
          // if (node instanceof THREE.Mesh) 
            if ((node.name.toLowerCase().includes("screen") || node.name.toLowerCase().includes("hvid")) && node.material) {
              this.screenMesh = node; 

              console.log("gotsa screen mesh");
            }
        });

        this.vidtexture = new THREE.VideoTexture( this.video );
        // this.vidtexture.flipY = this.data.flipY; 
        this.vidtexture.colorSpace = THREE.SRGBColorSpace;
        this.playmaterial = new THREE.MeshBasicMaterial( { map: this.vidtexture, shader: THREE.FlatShading } ); 
        if (this.screenMesh != null) {
          this.screenMesh.material = this.playmaterial;
          this.isInitialized = true;
        }
      }
    })
    //////////////////////////// - VID MATERIALS EMBED (e.g. streaming)
    AFRAME.registerComponent('vid_materials_embed', { 
      schema: {
        videoTitle: {default: ''},
        url: {default: ''},
        url_webm: {default: ''},
        url_mov: {default: ''},
        index: {default: 0},
        meshname: {default: ''},
        id: {default: ''},
        flipY: {default: false},
        isSkybox: {default: false}, //i.e. 360 vid //erm, try above vid_sphere
        eventData: {default: ''},
        vidGroupName: {default: ''},
        vidGroupArray: {default: {}},
        vGroupIDs: {default: []}
      },
      init: function () {
        console.log("tryna init video_mterials_embed video id is : " + this.data.id + " index " + this.data.index);
        this.video = null;
        /// ------------- cubemaap fu
        this.textureArray = [];
        this.el.classList.add("activeObjexRay");
       
        // this.id = "primary_video";  //hrm, could be multiples...
        this.cmTexture = new THREE.CubeTextureLoader().load(this.textureArray); //?
        this.cmTexture.format = THREE.RGBFormat; //not RGBA
        this.cmTexture.colorSpace = THREE.SRGBColorSpace;
        // let video = document.getElementById(this.data.id);
        // this.video = null;
        // this.video = document.getElementById(this.data.id);
        this.video = document.getElementById(this.data.id);

        this.streamIndex = 0;
        // primaryVideo = video;
        let m3u8 = '/hls/'+this.data.id;

        console.log("this.video is " + this.video.id + " m3u8 " + m3u8);

        //settings.sceneVideoStreams is set serverside for external streams, e.g. from mux.com
        if (settings != undefined && settings.sceneVideoStreams != null && settings.sceneVideoStreams.length > 0) {
          console.log("settings.sceneVideoStreams length is " + settings.sceneVideoStreams.length);
          m3u8 = settings.sceneVideoStreams[Math.floor((Math.random()*settings.sceneVideoStreams.length))];
          this.data.videoTitle = settings.sceneTitle;
        }
        if (Hls != undefined && Hls.isSupported()) {
         
            var hls = new Hls();
            hls.attachMedia(this.video);
            
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
              console.log('video and hls.js are now bound together !');
              hls.loadSource(m3u8);
              hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log(
                  'manifest loaded, found ' + data.levels.length + ' quality level'
                );
              });
            });
          // }
        } else {
          console.log("hls.js not supported (ios?), goiing native!");
          this.video.src = m3u8;
        }
        
          this.el.classList.add("video_embed");
          
          this.mesh = this.el.getObject3D('Object3D');
          this.screenMesh = null; 
          this.ffwdMesh = null; 
          this.rewindMesh = null; 
          this.isInitialized = false;
          let playButtonMesh = null;
          let pauseButtonMesh = null;
          this.playButtonMesh = null;
          this.pauseButtonMesh = null;
          this.play_button = null;  
          this.play_icon = null;
          this.pausematerial = null;
          this.playmaterial = null;
          this.slider_end = null;
          this.slider_begin = null;
          this.slider_handle = null;
          this.texture = null;
          this.durationtimeformat = 0;
          this.percent = 0;
          // this.camera = AFRAME.scenes[0].camera; 
          this.sceneEl = document.querySelector('a-scene');
          this.scene = document.querySelector('a-scene').object3D; 
          this.meshArray = [];
          let mouseOverObject = null; 
          let hitpoint = null;
          // this.screenIsTop = false;
          this.durationtimeformat = null;
          this.fancyTimeString = "";
        
          if (!this.data.isSkybox) {
          this.mesh.traverse(node => {
            // if (node instanceof THREE.Mesh) 
              if ((node.name.toLowerCase().includes("screen") || node.name.toLowerCase().includes("hvid")) && node.material) {
                this.screenMesh = node; 

                console.log("gotsa screen mesh");
                this.meshArray.push(this.screenMesh);

              } 
         
              if (node.name.toLowerCase().includes("fastforward")) {
                this.ffwdMesh = node; 
                this.meshArray.push(this.ffwdMesh);
              }
              if (node.name.toLowerCase().includes("frame")) {
                this.ffwdMesh = node; 
                this.meshArray.push(this.ffwdMesh);
              }
              if (node.name.toLowerCase().includes("background")) {
                this.ffwdMesh = node; 
                this.meshArray.push(this.ffwdMesh);
              }
              if (node.name.toLowerCase().includes("rewind")) {
                this.rewindMesh = node; 
                this.meshArray.push(this.rewindMesh);
              }
             
              if (node.name.toLowerCase().includes("play")) {
                this.playButtonMesh = node; 
                this.meshArray.push(this.playButtonMesh);

                console.log("gotsa play mesh");
              }
              if (node.name.toLowerCase().includes("play_button")) {
                this.play_button = node; 
                // this.meshArray.push(this.play_button);

                console.log("gotsa play_button mesh");
              }
              
             
              if (node.name.toLowerCase().includes("pause")) {
                this.pauseButtonMesh = node; 
                // this.pauseButtonMesh.visible = false;
                this.meshArray.push(this.pauseButtonMesh);
              }
              if (node.name.toLowerCase().includes("slider_end")) {
                this.slider_end = node; 
                console.log("gotsa slider end mesh");
              }
              if (node.name.toLowerCase().includes("slider_begin")) {
                this.slider_begin = node; 
                console.log("gotsa slider begin mesh");
              }
              if (node.name.toLowerCase().includes("slider_handle")) {
                this.slider_handle = node; 
                console.log("gotsa slider handle mesh");
              }
              // if (this.pauseButtonMesh)
            // }
          }); 
        } else { //if 360
          // playVideo(this.video);          
          this.mesh = this.el.getObject3D('mesh');
          this.screenMesh = this.mesh;
          this.meshArray.push(this.screenMesh);
          console.log("this.screenmesdh" + this.screenMesh);

        }

          for (let m = 0; m < this.meshArray.length; m++) {
            if (this.meshArray[m].material != undefined && this.meshArray[m].material != null && this.cmTexture != undefined && this.cmTexture != null) {
              this.meshArray[m].material.envMap = this.cmTexture;        
              this.meshArray[m].material.envMap.intensity = 1;
              this.meshArray[m].material.needsUpdate = true;
            }
          }
          if (this.slider_handle != null) {
            let videoNameText = document.createElement("a-text");
            this.el.appendChild(videoNameText);
            videoNameText.setAttribute("position", "-.2 .45 -1");
            videoNameText.setAttribute("scale", "1 1 1"); 
            // bubbleText.setAttribute("look-at", "#player");
            videoNameText.setAttribute("width", 3);
            videoNameText.setAttribute("height", 2);
            videoNameText.setAttribute('text', {
              // width: 4, 
              align: "left",
              value: this.data.videoTitle,
              font: "/fonts/Exo2Bold.fnt",
              anchor: "center",
              wrapCount: 100,
              color: "white",
            });

            this.videoStatus = document.createElement("a-text");
            this.el.appendChild(this.videoStatus);
            this.videoStatus.setAttribute("position", "2.4 .5 -1");
            this.videoStatus.setAttribute("scale", "1 1 1"); 
            // bubbleText.setAttribute("look-at", "#player");
            this.videoStatus.setAttribute("width", 3);
            this.videoStatus.setAttribute("height", 2);
            this.videoStatus.setAttribute('text', {
              // width: 4, 
              align: "left",
              value: "click to play!",
              font: "/fonts/Exo2Bold.fnt",
              anchor: "center",
              wrapCount: 100,
              color: "white",
            });
          }
          // var texture = new THREE.VideoTexture( this.video );
          // this.vidtexture = texture;
        //   this.videoControl();

        //   // setTimeout(this.videoControl(), 1000);
        // // });
        // }, 
        // videoControl: function () {
          console.log("videoControl init");
          // playVideo(this.video);
          //apple needs a click
            // if (!this.isInitialized) {
              if (timedEventsListenerMode == null) {
                timedEventsListenerMode = "Primary Video";
              }

              this.vidtexture = new THREE.VideoTexture( this.video );
              this.vidtexture.flipY = this.data.flipY; 
              this.vidtexture.colorSpace = THREE.SRGBColorSpace;
              // this.vidtexture.minFilter = THREE.LinearMipmapNearestFilter;
              // this.vidtexture.magFilter = THREE.LinearMipmapNearestFilter;
              // this.playmaterial = new THREE.MeshStandardMaterial( { map: this.vidtexture, side: THREE.DoubleSide, shader: THREE.FlatShading } ); 
              if (this.data.isSkybox) {
                this.playmaterial = new THREE.MeshBasicMaterial( { map: this.vidtexture, side: THREE.BackSide, shader: THREE.FlatShading } ); 
              } else {
                this.playmaterial = new THREE.MeshBasicMaterial( { map: this.vidtexture, shader: THREE.FlatShading } ); 
              }
              

              console.log("tryna bind vid material to mesh");

              // this.playmaterial.generateMipmaps = true;   
              this.playmaterial.map.needsUpdate = true;   
              this.playmaterial.needsUpdate = true;


              if (this.screenMesh != null) {
                this.screenMesh.material = this.playmaterial;
                this.isInitialized = true;
              }

              if (this.pauseButtonMesh != null) {
                this.pauseButtonMesh.visible = false;
              }

              if (this.pauseButtonMesh != null) {
                this.playButtonMesh.visible = false;
              }

              
              this.redmat = new THREE.MeshStandardMaterial({
                color: "red"    
                
              });
              this.greenmat = new THREE.MeshStandardMaterial({
                color: "lightgreen"    
                
              });
              this.yellowmat = new THREE.MeshStandardMaterial({
                color: "yellow"    
                
              });
              this.bluemat = new THREE.MeshStandardMaterial({
                color: "blue"    
                
              });
              this.player_status_update("loading");
              this.video.addEventListener( 'canplay', this.player_status_update("ready"), false); //next step when kinda loaded
          // let thiz = this; //? localscope, but not updated like this
          // thiz.duration = this.duration;
          this.raycaster = null;
          this.intersection = null;
          this.hitpoint = null;

        this.el.addEventListener('raycaster-intersected', (e) => {  
          // if (this.video != undefined) {
            this.raycaster = e.detail.el;
            this.intersection = this.raycaster.components.raycaster.getIntersection(this.el);
            this.hitpoint = this.intersection.point;
            this.mouseOverObject = this.intersection.object.name;      
            console.log('ray hit' + this.intersection.point + this.intersection.object.name + " " + this.data.isSkybox);
          if (this.data.isSkybox) {
            this.mouseOverObject = this.el.getObject3D("mesh");
          } else if (!this.intersection.object.name.includes("hvid") &&
              !this.intersection.object.name.includes("screen") &&
              !this.intersection.object.name.includes("background") &&
              !this.intersection.object.name.includes("fastforward") &&
              !this.intersection.object.name.includes("rewind") &&
              !this.intersection.object.name.includes("previous") &&
              !this.intersection.object.name.includes("next") &&
              !this.intersection.object.name.includes("handle") &&
              !this.intersection.object.name.includes("play") &&
              !this.intersection.object.name.includes("pause")) {
                this.raycaster = null;
                this.mouseOverObject = null;

              } else {
                  this.mouseOverObject = this.intersection.object.name;      
                  // this.hitpoint = this.intersection.point;   
                  console.log('ray hit', this.intersection.point, this.intersection.object.name, this.mouseOverObject );
              }
        // } else {
        //   // console.log("this.video is undefined!");
        // }
      });
      this.el.addEventListener("raycaster-intersected-cleared", () => {
          console.log("intersection cleared");
          // if (this.video != undefined) {
          // thiz.raycaster = null;
          this.raycaster = null;
          this.mouseOverObject = null;
          // }
      });
      this.el.addEventListener('click', (e) =>  {
        e.preventDefault();
   
        
        if (this.video != undefined && this.video != null) {

            if (this.data.isSkybox) {
              console.log("tryna play skybox vid");
              // this.togglePlayPauseVideo();
              if (this.video.paused) {
                console.log("tryna play!");
                playVideo(this.video);
              }
              // this.el.getObject3D('mesh').scale.set(200, 200, 200);
              // this.el.components.a-sphere.setAttribute("radius", 100);
            } else {

            this.nStart = new THREE.Vector3();
            this.nEnd = new THREE.Vector3();
            if (this.slider_begin != undefined) {
              this.slider_begin.getWorldPosition( this.nStart );
              this.slider_end.getWorldPosition( this.nEnd );
            }
            // thiz.video = this.video;
            
            if (this.raycaster != null) {
                

              if (this.mouseOverObject.includes("play") || this.mouseOverObject.includes("play_button") || this.mouseOverObject.includes("screen") || this.mouseOverObject.includes("hvid")) {
                console.log(this.mouseOverObject + "video paused " + this.video.paused + "video readyState " + this.video.readyState);
                // this.togglePlayPauseVideo();
                if (this.video.paused) {
                  console.log("tryna play!");
                  playVideo(this.video);
                  this.sceneEl.emit('primaryVideoToggle', {isPlaying : true}, true);
                  // this.isPlaying = true;
                  if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = true;
                    this.playButtonMesh.visible = false;
                  }
                  
                  this.player_status_update("playing");
                  // this.play_button.material = this.greenmat;
                  // break;
                } else {
                  if (this.video.readyState > 2) {
                    console.log("tryna pauyse!");
                    
                    pauseVideo(this.video);
                    this.sceneEl.emit('primaryVideoToggle', {isPlaying : false}, true);
                    // this.isPlaying = false;
                    if (this.pauseButtonMesh != null) {
                      this.pauseButtonMesh.visible = false; 
                      this.playButtonMesh.visible = true;   
                    }
                  this.player_status_update("paused");
                  // this.play_button.material = this.redmat;
                  
                  // break;
                }
              }
              // break;
            } else if (this.mouseOverObject.includes("next")) {
              this.switchVideo();
              console.log("next button down!");
            } else if (this.mouseOverObject.includes("slider_background") && (this.video.duration && this.video.duration > 0)) {

                    // this.slider_begin.position.y/this.slider_end.position.y 
                    let nStart = new THREE.Vector3();
                    let nEnd = new THREE.Vector3();
                    this.slider_begin.getWorldPosition( nStart );
                    this.slider_end.getWorldPosition( nEnd );
                    console.log("background hit at " + JSON.stringify(this.hitpoint) );
                    let range = nEnd.x.toFixed(2) - nStart.x.toFixed(2);
                    let correctedStartValue = 0;
                    correctedStartValue = this.hitpoint.x.toFixed(2) - nEnd.x.toFixed(2);
                    let percentage = 0;
                    percentage = (((correctedStartValue * 100) / range) + 100).toFixed(2); 
                    let time = (percentage * (this.video.duration / 100)).toFixed(2);

                    // let touchPosition = (((intersects[i].point.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)) * 100) / (this.slider_end.position.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)));
                    // console.log("bg touch % " + percentage +  " touchPosition " + + JSON.stringify(this.hitpoint) + " vs start " +  JSON.stringify(nStart) + " vs end " +  JSON.stringify(nEnd));
                    // this.slider_handle.position.x = intersects[i].point.x; 
                    // this.slider_handle.position.z =  nStart.z;
                    // this.slider_handle.position.z =  nStart.y; 
                    this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, percentage * .01);
                    this.video.currentTime = time;
                    
                    // break;
                
                } else if (this.mouseOverObject.includes("handle")) {
                    console.log("handle");
                
                } else if (this.mouseOverObject.includes("fastforward")) {
                  console.log("ffwd");
                  pauseVideo(this.video);
                  if (this.video.currentTime + 10 < this.video.duration) {
                    this.video.currentTime = this.video.currentTime + 10;
                  }
                  if (this.pauseButtonMesh != null) {
                  this.pauseButtonMesh.visible = false;
                  }
                  if (this.playButtonMesh != null) {
                  this.playButtonMesh.visible = true;
                  }
                  // break;

                } else if (this.mouseOverObject.includes("rewind")) {
                  console.log("rewind");
                  pauseVideo(this.video);
                  if (this.video.currentTime - 10 > 0) {
                    this.video.currentTime = this.video.currentTime - 10;
                  }
                  if (this.pauseButtonMesh != null) {
                  this.pauseButtonMesh.visible = false;
                  }
                  if (this.playButtonMesh != null) {
                  this.playButtonMesh.visible = true;

                  }
                  // break;
                }
              // this.raycaster = null;
              }
            }
          } else {
            console.log("this.video is undefined!");
          }
          });
        },
        switchVideo() {
         
            console.log("video data: index " + this.data.index + " id " + this.data.id + " "  + JSON.stringify(this.data.vidGroupArray));
            if (this.data.vidGroupArray.length > this.data.index) {
              this.data.index++;
            } else {
              this.data.index = 0;
            }
            this.data.id = this.data.vidGroupArray[this.data.index]._id;
            console.log("next video data: index " + this.data.index + " id " + this.data.id);
            
           
  

          let m3u8 = '/hls/'+this.data.id;
          this.streamIndex = this.streamIndex++;

          if (settings != undefined && settings.sceneVideoStreams != null && settings.sceneVideoStreams.length > 0) {
            console.log("settings.sceneVideoStreams length is " + settings.sceneVideoStreams.length);
            m3u8 = settings.sceneVideoStreams[this.streamIndex];
            this.data.videoTitle = settings.sceneTitle;
          }
          if (Hls != undefined && Hls.isSupported()) {
           
              var hls = new Hls();
              hls.attachMedia(this.video);
              
              hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log('video and hls.js are now bound together !');
                hls.loadSource(m3u8);
                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                  console.log(
                    'manifest loaded, found ' + data.levels.length + ' quality level'
                  );
                });
              });
            // }
          } else {
            console.log("hls.js not supported (ios?), goiing native!");
            this.video.src = m3u8;
          }
        },
        randomTime () {
          let randomTimeValue = Math.random() * (this.video.duration - 1) + 1;
          this.video.currentTime = randomTimeValue;
        },
        gotoTime (seconds) {

          this.video.currentTime = seconds;
        },
        togglePlayPauseVideo () {
          if (this.video.paused) {
            console.log("tryna play!");
            playVideo(this.video);
            this.sceneEl.emit('primaryVideoToggle', {isPlaying : true}, true);
            // this.isPlaying = true;
            if (this.pauseButtonMesh != null) {
            this.pauseButtonMesh.visible = true;
            this.playButtonMesh.visible = false;
            }
            
            this.player_status_update("playing");
            return true;
            // this.play_button.material = this.greenmat;
            // break;
          } else {
            if (this.video.readyState > 2) {
            console.log("tryna pauyse!");
            
            pauseVideo(this.video);
            this.sceneEl.emit('primaryVideoToggle', {isPlaying : false}, true);
            // this.isPlaying = false;
            if (this.pauseButtonMesh != null) {
            this.pauseButtonMesh.visible = false; 
            this.playButtonMesh.visible = true;   
            }
            this.player_status_update("paused");
            return false;
            // this.play_button.material = this.redmat;
            
            // break;
          }
        }
        },
        current_player_state () {
          return this.playerState;
        },
        player_status_update (state) {
          this.playerState = state;
          
            if (this.play_button != null) {
                if (state == "loading") {
                  this.play_button.material = this.yellowmat;
                  // if (this.transportPlayButton != null) {
                  //     this.transportPlayButton.style.color = 'yellow';
                      
                  // }
                  // this.screen.material = this.loadingMaterial;
                
                } else if (state == "ready") {
                    this.play_button.material = this.bluemat;
                  //   if (this.transportPlayButton != null) {
                  //     this.transportPlayButton.style.color = 'blue';
                  // }
                  // this.screen.material = this.readyMaterial;
                } else if (state == "playing") {
                    this.play_button.material = this.greenmat;
                  //   if (this.transportPlayButton != null) {
                  //     this.transportPlayButton.style.color = 'lightgreen';
                  // }
                  // this.screen.material = this.playingMaterial;
                } else if (state == "paused") {
                    this.play_button.material = this.redmat;
                  //   if (this.transportPlayButton != null) {
                  //     this.transportPlayButton.style.color = 'red';
                  // }
                  // this.screen.material = this.pausedMaterial;
                }
            }
        },
        tick: function () {

          if (this.video != null && this.video != undefined) {
            if (this.durationtimeformat = null) {
              this.durationtimeformat = fancyTimeFormat(this.video.duration)
            }
            if (!this.video.paused && this.slider_handle != null) {
              this.playmaterial.map.needsUpdate = true;  
              currentTime = this.video.currentTime.toFixed(2);
              this.percent = this.video.currentTime / this.video.duration;
              // console.log(this.percent);
              this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, this.percent);
              this.fancyTimeString = fancyTimeFormat(this.video.currentTime)  + " / "+ fancyTimeFormat(this.video.duration)  + " : " + (this.percent * 100).toFixed(2) +" %\n"+currentTime;
              this.videoStatus.setAttribute('text', {
                // width: 4, 
                align: "left",
                value: this.fancyTimeString,
                font: "/fonts/Exo2Bold.fnt",
                anchor: "center",
                wrapCount: 100,
                color: "white",
              });
              MediaTimeUpdate(this.fancyTimeString);
            }
          }
        }   
    });

    ////////////////////////////////////
    function fancyTimeFormat(duration) {   
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
  
  function fancyTimeFormat(duration) {   
      // Hours, minutes and seconds
      var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
  }



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
        } else {
          console.log("tryna pauyse!");
          video.pause();
          this.isPlaying = false;
        }
      }
    }); 


    AFRAME.registerComponent('color_tweak', { //for videosphere, move this to utils later

      init: function () {
        this.isPlaying = false;
        this.onClick = this.onClick.bind(this);

      },
      tick: function () {

      }
    });
    
  
    /* global THREE, AFRAME */

AFRAME.registerSystem('trail', {
  schema: {},  // System schema. Parses into `this.data`.

  init: function () {
    this.isDead = false;
    this.trailmesh = null;
  },
  
  trails: { haveTrails: [] },
  
  createTrail: function createTrail( object, length, width, resolution, color, offset ) {
    // resolution must be less than the length
    if ( resolution > length ) resolution = length;

    if (!object.userData.trails) object.userData.trails = [];

    const trail = {
      length: Math.round( length ),
      width: width,
      resolution: Math.round( resolution ),
      trailHistory: [],
      trailVertexPositions: [],
      worldDirection: new THREE.Vector3(),
    }
    object.userData.trails.push(trail);

    // trail geo
    var geometry = new THREE.PlaneGeometry( 1, length, 1, resolution );
    var material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide, wireframe: false, transparent: true, opacity: 0.2 } ); // opacity: 0.2
    trail.mesh = new THREE.Mesh( geometry, material );
    trail.mesh.position.add(offset);
    this.trailmesh = trail.mesh;
    this.el.sceneEl.object3D.add( trail.mesh );

    this.trails.haveTrails.push( object );
    // setting frustumCulled to false is important because we move the vertices outside the frustum, not the geometry itself
    trail.mesh.frustumCulled = false; 
    // create history and store vertices
    trail.trailHistory = [];
    trail.trailVertexPositions = geometry.getAttribute("position");
  },

  updateTrailHistory: function updateTrailHistory( object ) {
    object.userData.trails.forEach(trail=>{
      object.getWorldDirection( trail.worldDirection );
      trail.trailHistory.push( [ object.position.x, object.position.y, object.position.z,       trail.worldDirection.x, trail.worldDirection.z ] );
    if ( trail.trailHistory.length > trail.length ) {
      trail.trailHistory.shift();
    }
    });  
  },

  updateTrails: function updateTrails() {
    for ( let i = 0; i < this.trails.haveTrails.length; i++ ) {
      const object = this.trails.haveTrails[i];
      this.updateTrailHistory( object );
      object.userData.trails.forEach( trail => {
        for ( var j = 0; j < trail.resolution + 1; j++ ) {
        var index = Math.round( trail.trailHistory.length / trail.resolution * j );
        if ( index === trail.trailHistory.length ) index = trail.trailHistory.length - 1;
        var pos = trail.trailHistory[index];
        // custom the shape changing this width parameter
        var width = THREE.MathUtils.mapLinear( j, 0, trail.resolution + 1, 0, 1 ) * trail.width / 2;
        if ( typeof pos != "undefined" ) {
          // update vertices using a "2D cross product"
          // one side of the trail, left or right
          const leftIndex = j * 2 * 3;
          trail.trailVertexPositions.array[leftIndex] = pos[0] - pos[4] * width;
          trail.trailVertexPositions.array[leftIndex + 1] = pos[1];
          trail.trailVertexPositions.array[leftIndex + 2] = pos[2] + pos[3] * width;
          // the other side of the trail
          const rightIndex = (j * 2 + 1) * 3;
          trail.trailVertexPositions.array[rightIndex] = pos[0] + pos[4] * width;
          trail.trailVertexPositions.array[rightIndex + 1] = pos[1];
          trail.trailVertexPositions.array[rightIndex + 2] = pos[2] - pos[3] * width;
        }
      }
      trail.trailVertexPositions.needsUpdate = true;
      });
    }
  },
  
  resetTrail: function resetTrail( object ) {
    object.userData.trails.forEach(trail=>{
      trail.trailHistory = [];
    });
  },

  killTrail: function killTrail (object) {
    object.userData.trails.forEach(trail=>{
      // length = 0;
      // width = 0;
      resolution = 0;
      trailHistory = [];
      // trail.trailVertexPositions = [];
    });
    this.el.sceneEl.object3D.remove( this.trailmesh );
    // object.userData.trails = [];
    // // this.isDead = true;
    // this.el.sceneEl.object3D.remove( trail.mesh );
  },
  
  tick: function(t,dt){
    // if (!this.isDead) {
      this.updateTrails();
    // }
   
  }
});

AFRAME.registerComponent('trail', {
  schema: {
    length: {default: 80},
    width: {default: 0.8},
    resolution: {default: 18},//must be less than length
    color: {default: 'white'},
    offset: {type: 'vec3'}
  },
  multiple: true,
  init: function () {
    this.system.createTrail(this.el.object3D,this.data.length,this.data.width,this.data.resolution,this.data.color,this.data.offset);
  },
  reset: function(){
    this.system.resetTrail(this.el.object3D);
  },
  kill: function(){
    this.system.killTrail(this.el.object3D);
  }
});

AFRAME.registerComponent('glow', {
  schema: {
    color: {default: '#ffffff', type: 'color'},
    intensity: {default: 10.0}
  },
  init: function () {
    this.el.addEventListener('object3dset', function () {
      this.update();
    }.bind(this));
  },
  update: function () {
    var data = this.data;
    this.el.object3D.traverse(function (node) {
      if (node.isMesh) {
        node.material.emissive.copy(new THREE.Color(data.color));
        node.material.emissiveIntensity = data.intensity;
      }
    });
  }
});

/**
	Plays a spritesheet-based animation.
	Author: Lee Stemkoski
*/
AFRAME.registerComponent('spritesheet-animation', {

	schema: 
	{
  		rows: {type: 'number', default: 1},
  		columns: {type: 'number', default: 1},

  		// set these values to play a (consecutive) subset of frames from spritesheet
		firstFrameIndex: {type: 'number', default: 0},
		lastFrameIndex: {type: 'number', default: -1}, // index is inclusive

		// goes from top-left to bottom-right.
		frameDuration: {type: 'number', default: 1}, // seconds to display each frame
  		loop: {type: 'boolean', default: true},
	},

	init: function()
	{
		this.repeatX = 1 / this.data.columns;
		this.repeatY = 1 / this.data.rows;

		if (this.data.lastFrameIndex == -1) // indicates value not set; default to full sheet
			this.data.lastFrameIndex = this.data.columns * this.data.rows - 1;

		this.mesh = this.el.getObject3D("mesh");

		this.frameTimer = 0;
		this.currentFrameIndex = this.data.firstFrameIndex;
		this.animationFinished = false;
	},
	
	tick: function (time, timeDelta) 
	{
		// return if animation finished.
		if (this.animationFinished)
			return;

		this.frameTimer += timeDelta / 1000;

		while (this.frameTimer > this.data.frameDuration)
		{
			this.currentFrameIndex += 1;
			this.frameTimer -= this.data.frameDuration;

			if (this.currentFrameIndex > this.data.lastFrameIndex)
			{
				if (this.data.loop)
				{
					this.currentFrameIndex = this.data.firstFrameIndex;
				}
				else
				{
					this.animationFinished = true;
					return;
				}
			}
		}

		let rowNumber = Math.floor(this.currentFrameIndex / this.data.columns);
		let columnNumber = this.currentFrameIndex % this.data.columns;
		
		let offsetY = (this.data.rows - rowNumber - 1) / this.data.rows;
		let offsetX = columnNumber / this.data.columns;

		if ( this.mesh.material.map )
		{
			this.mesh.material.map.repeat.set(this.repeatX, this.repeatY);
			this.mesh.material.map.offset.set(offsetX, offsetY);
		}
	}
});
//from  https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_sprites.html
AFRAME.registerComponent('sky_particles', {

	schema: 
	{
    type: {default: 'dust'},
    size: {type: 'number', default: 1},
  		rows: {type: 'number', default: 1},
  		columns: {type: 'number', default: 1},

  		// set these values to play a (consecutive) subset of frames from spritesheet
		firstFrameIndex: {type: 'number', default: 0},
		lastFrameIndex: {type: 'number', default: -1}, // index is inclusive

		// goes from top-left to bottom-right.
		frameDuration: {type: 'number', default: 1}, // seconds to display each frame
  		loop: {type: 'boolean', default: true},
      src: {type: 'string', default: ''}

	},
  //   vertexShader:`
  //   v attribute vec2 offset;

  //   varying vec2 vOffset;
    
  //   void main() {
    
  //       vOffset = offset;
    
  //       gl_PointSize = 25.0;
    
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
  //   }
  // `,

  // fragmentShader:`
    
  // uniform sampler2D spriteSheet;
  // uniform vec2 repeat;

  // varying vec2 vOffset;

  // void main() {

  //     vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );

  //     vec4 tex = texture2D( spriteSheet, uv * repeat + vOffset );
      
  //     if ( tex.a < 0.5 ) discard;

  //     gl_FragColor = tex;

  // }
  // `,
 
  init: function () {
    const vertices = [];
    this.vectors = []
    let amount = 100;
    if (this.data.type == "rain" || this.data.type == "dust") {
      amount = 4000;
    } 

     
    for (let i = 0; i < amount; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y =THREE.MathUtils.randFloat(1,20);
      const z = THREE.MathUtils.randFloatSpread(200);
      vertices.push(x, y, z);
      const vertex = new THREE.Vector3(x, y, z);

      vertex.rotationAxis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      vertex.rotationAxis.normalize();
      vertex.rotationSpeed = Math.random() * 0.001;
      this.vectors.push(vertex);

    }
    if (this.data.type == 'dust') {
      this.data.size = .25;
    }



    // create a geometry from the points
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    var colors = [];
    var color = new THREE.Color();
    
    
    var colorList = ['skyblue', 'navy', 'blue'];
    if (settings && settings.sceneColor2 && settings.sceneColor3 && settings.sceneColor4 ) {
      colorList = [settings.sceneColor2, settings.sceneColor3, settings.sceneColor4];
    }
    for (let i = 0; i < this.geometry.attributes.position.count; i++) {
      color.set(colorList[THREE.MathUtils.randInt(0, colorList.length - 1)]);
      color.toArray(colors, i * 3);
    }
    this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    // small grey points material
    const textureLoader = new THREE.TextureLoader();

				const assignSRGB = ( texture ) => {

					texture.colorSpace = THREE.SRGBColorSpace;

				};

    const sprite1 = textureLoader.load( this.data.src, assignSRGB );
    const material = new THREE.PointsMaterial({ size: this.data.size, map: sprite1, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, vertexColors: true });
    // const material = new THREE.PointsMaterial( { size: 2, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true } );
    // materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
    // material.color.setHSL( color[ .1 ], color[ .2 ], color[ .3 ], THREE.SRGBColorSpace );
    // setObject3D sets the points under the name 'cloud'
    this.points = new THREE.Points(this.geometry, material);
    this.el.setObject3D("cloud", this.points);
    // this.el.object3D.rotation.x = Math.random() * 6;
    // this.el.object3D.rotation.y = Math.random() * 6;
    // this.el.object3D.rotation.z = Math.random() * 6;
    if (this.data.type == "rain") {
      this.el.object3D.position.x = 50;
      this.el.object3D.position.y = 0;
      this.el.object3D.position.z = -50;
    } else {
      this.el.object3D.position.x = 0;
      this.el.object3D.position.y = 0;
      this.el.object3D.position.z = 0;
    }
  
    // particles.rotation.x = Math.random() * 6;
    // particles.rotation.y = Math.random() * 6;
    // particles.rotation.z = Math.random() * 6;
    // this.el.setAttribute("animation", )
    const posAttribute = this.points.geometry.getAttribute('position');
              this.posArray = posAttribute.array;
  },
  tick: function (time) {
    // const time = Date.now() * 0.005;
 
    if (this.posArray) {
				// this.el.object3D.rotation.x = 0.000001 * time;
        if (this.data.type == 'dust') {
          this.el.object3D.rotation.y = Math.sin(0.00002 * time);
          this.el.object3D.rotation.z = Math.sin(0.00001 * time);

        } else if (this.data.type == 'rain') {
          
          // this.points.geometry.getAttribute('position');
          // var geometry = ps.geometry;
          // const positions = this.points.geometry.attributes.position.array;
          // console.log("Positions length is " + positions.length);
          const posAttribute = this.points.geometry.getAttribute('position');
          positions = posAttribute.array;
          for (let i = 0; i < positions.length; i++) {
            if (positions[ i + 1 ] < -1) {
              // console.log('positoin ' + positions[i + 1]);
              // positions[ i + 1 ] = 30;
              positions[ i ] = THREE.MathUtils.randFloatSpread(200);
              positions[ i + 1 ] = THREE.MathUtils.randFloat(0,20);
              positions[ i + 2 ] = THREE.MathUtils.randFloatSpread(200);

            } else {
              positions[ i + 1 ] = positions[ i + 1 ] - .1;
            }
            
          }
        } else if (this.data.type == 'snow') {
          
          // this.points.geometry.getAttribute('position');
          // var geometry = ps.geometry;
          // const positions = this.points.geometry.attributes.position.array;
          // console.log("Positions length is " + positions.length);
          const posAttribute = this.points.geometry.getAttribute('position');
          positions = posAttribute.array;
          for (let i = 0; i < positions.length; i++) {
            if (positions[ i + 1 ] < -1) {
              // console.log('positoin ' + positions[i + 1]);
              // positions[ i + 1 ] = 30;
              positions[ i ] = THREE.MathUtils.randFloatSpread(200);
              positions[ i + 1 ] = THREE.MathUtils.randFloat(0,20);
              positions[ i + 2 ] = THREE.MathUtils.randFloatSpread(200);

            } else {
              positions[ i + 1 ] = positions[ i + 1 ] - .01;
            }
            
          }
        } else if (this.data.type == "smoke") {
          this.el.object3D.rotation.y = Math.sin(0.00001 * time);
        }
          // this.points.forEach(function(v){
          //     v.y = ( Math.sin( (v.x/2+step) * Math.PI*2 )
          //           + Math.cos( (v.z/2+step*2) * Math.PI )
          //           + Math.sin( (v.x+v.y+step*2) / 4*Math.PI ) ) / 2;
          // });
        
        //   for (let i = 0; i <  this.posArray.length; i++) {
        //     // if (i == 0) {
        //     //   console.log(this.posArray[i]);
        //     // }                
        //         // ps[i] = vector.x;

        //         this.posArray[i + 1] -= 1;
        //         // ps[i + 2] = vector.z;
        //       }
        // }
      }
				// const geometry = this.el.getObject3D('mesh');
				// const attributes = this.points.geometry.attributes;
        // for (let i = 0; i < attributes.position.count; i++) {
        //   console.log(attributes[i]);

        // }

              // const posAttribute = this.points.geometry.getAttribute('position');
              // const ps = posAttribute.array;
            
              // // const updateParticles = () => {
              //   // loop over vectors and animate around sphere
              //   for (let i = 0; i < this.vectors.length; i++) {
              //     const vector = this.vectors[i];
              //     vector.applyAxisAngle(vector.rotationAxis, vector.rotationSpeed);
            
              //     ps[i] = vector.x;
              //     ps[i + 1] = vector.y;
              //     ps[i + 2] = vector.z;
              //   }
              //   // this.points.rotation.y = Math.sin(time * .0001);
              //   this.points.geometry.attributes.position.needsUpdate = true;
        // }
				// for ( let i = 0; i < attributes.size.array.length; i ++ ) {

				// 	attributes.size.array[ i ] = 14 + 13 * Math.sin( 0.1 * i + time );

				// }

				this.points.geometry.attributes.position.needsUpdate = true;
  },
 	ninit: function()	{
    let camera, scene, renderer, stats, parameters;
			let mouseX = 0, mouseY = 0;

			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;

			const materials = [];
      const geometry = new THREE.BufferGeometry();
				const vertices = [];

				const textureLoader = new THREE.TextureLoader();

				const assignSRGB = ( texture ) => {

					texture.colorSpace = THREE.SRGBColorSpace;

				};


				const sprite1 = textureLoader.load( 'http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png', assignSRGB );
				const sprite2 = textureLoader.load( 'http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png', assignSRGB );
				const sprite3 = textureLoader.load( 'http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png', assignSRGB );
				const sprite4 = textureLoader.load( 'http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png', assignSRGB );
				const sprite5 = textureLoader.load( 'http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png', assignSRGB );

				for ( let i = 0; i < 10000; i ++ ) {

					const x = Math.random() * 2000 - 1000;
					const y = Math.random() * 2000 - 1000;
					const z = Math.random() * 2000 - 1000;

					vertices.push( x, y, z );

				}

				geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

				parameters = [
					[[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
					[[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
					[[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
					[[ 0.85, 0, 0.5 ], sprite5, 8 ],
					[[ 0.80, 0, 0.5 ], sprite4, 5 ]
				];

				for ( let i = 0; i < parameters.length; i ++ ) {

					const color = parameters[ i ][ 0 ];
					const sprite = parameters[ i ][ 1 ];
					const size = parameters[ i ][ 2 ];

					materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
					materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ], THREE.SRGBColorSpace );

					const particles = new THREE.Points( geometry, materials[ i ] );

					particles.rotation.x = Math.random() * 6;
					particles.rotation.y = Math.random() * 6;
					particles.rotation.z = Math.random() * 6;

					this.el.setObject3D( "cloud", particles );

				}
        
        
      
  }
});

//from  https://github.com/dmarcos/aframe-fx
AFRAME.registerComponent('sprite-animation', {
  schema: {
    spriteWidth: {default: 256},
    spriteHeight: {default: 256},
    duration: {default: 1000}
  },
  vertexShader:`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader:`
    varying vec2 vUv;
    uniform sampler2D uMap;
    uniform float uSpriteIndex;
    uniform float uSpriteWidth;
    uniform float uSpriteHeight;

    void main() {
      float u = uSpriteIndex * uSpriteWidth;
      u = u - floor(u);
      float v = floor(uSpriteIndex * uSpriteWidth);
      v = v * uSpriteHeight;
      vec2 uv = vec2(u + vUv.x * uSpriteWidth, 1.0 - (v + uSpriteHeight - vUv.y * uSpriteHeight));

      gl_FragColor = texture2D(uMap, uv);
    }`,

  init: function () {
    var mesh;
    this.initGeometry();
    this.initShader();

    mesh = new THREE.Mesh(this.geometry, this.shader);
    this.el.setObject3D('mesh', mesh);
  },

  initGeometry: function () {
    var geometry = this.geometry = new THREE.BufferGeometry();
    var vertexCoordinateSize = 3; // 3 floats to represent x,y,z coordinates.
    var uvCoordinateSize = 2; // 2 float to represent u,v coordinates.
    var quadSize = 0.8;
    var quadHalfSize = quadSize / 2.0;
    var wireframeSystem = this.el.sceneEl.systems.wireframe;

    var positions = [
      -quadHalfSize, -quadHalfSize, 0.0, // bottom-left
       quadHalfSize, -quadHalfSize, 0.0, // bottom-right
      -quadHalfSize, quadHalfSize, 0.0, // top-left
       quadHalfSize, quadHalfSize, 0.0  // top-right
    ];

    var uvs = [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ];

    // Counter-clockwise triangle winding.
    geometry.setIndex([
      3, 2, 0, // top-left triangle.
      0, 1, 3  // bottom-right triangle.
    ]);

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, vertexCoordinateSize));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, uvCoordinateSize));

    wireframeSystem.unindexBufferGeometry(geometry);
    wireframeSystem.calculateBarycenters(geometry);
  },

  initShader: function() {
    var self = this;
    var uniforms = {
      uMap: {type: 't', value: null},
      uSpriteIndex: {type: 'f', value: 0},
      uSpriteWidth: {type: 'f', value: 0},
      uSpriteHeight: {type: 'f', value: 0}
    };
    var shader = this.shader = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true
    });

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/explosion.png', function (texture) {
      var spriteHeight = self.data.spriteHeight;
      var spriteWidth = self.data.spriteWidth;
      var imageWidth = texture.image.width;
      var imageHeight = texture.image.height;
      shader.uniforms.uSpriteWidth.value = spriteWidth / imageWidth;
      shader.uniforms.uSpriteHeight.value = spriteHeight / imageHeight;
      shader.uniforms.uMap.value = texture;

      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.magFilfer = THREE.NearestFilter;
    });
  },

  tick: function (time) {
    var startTime = this.startTime = this.startTime || time;
    var elapsedTime = time - this.startTime;
    var duration = this.data.duration;
    if (elapsedTime > duration) {
      elapsedTime = 0;
      this.startTime = time;
    }
    var spriteIndex = Math.floor((elapsedTime / duration) * 64);
    this.shader.uniforms.uSpriteIndex.value = spriteIndex;
  }
});

AFRAME.registerComponent('particle-system-instanced', {
  schema: {
    particleRate: {default: 50},
    particlesNumber: {default: 1000},
    particleSize: {default: 0.1},
    particleSpeed: {default: 0.005},
    particleLifeTime: {default: 1000},
    src: {type: 'map'}
  },
  vertexShader:`
    attribute float visible;
    varying vec2 vUv;
    varying float vVisible;

    void main() {
      vUv = uv;
      vVisible = visible;
      vec4 mvPosition = instanceMatrix * vec4( position, 1.0 );
      vec4 modelViewPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,

  fragmentShader:`
    varying float vVisible;
    varying vec2 vUv;
    uniform sampler2D uMap;

    void main() {
      if (vVisible == 1.0) {
        gl_FragColor = texture2D(uMap, vUv);
      } else {
        discard;
      }

    }`,
//   vertexShader:`
//   precision highp float;
//   uniform mat4 modelViewMatrix;
//   uniform mat4 projectionMatrix;
//   uniform float time;

//   attribute vec3 position;
//   attribute vec2 uv;
//   attribute vec3 translate;

//   varying vec2 vUv;
//   varying float vScale;

//   void main() {

//     vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
//     vec3 trTime = vec3(translate.x + time,translate.y + time,translate.z + time);
//     float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
//     vScale = scale;
//     scale = scale * 10.0 + 10.0;
//     mvPosition.xyz += position * scale;
//     vUv = uv;
//     gl_Position = projectionMatrix * mvPosition;

//   }
// `,

// fragmentShader:`
// precision highp float;

// uniform sampler2D map;

// varying vec2 vUv;
// varying float vScale;

// // HSL to RGB Convertion helpers
// vec3 HUEtoRGB(float H){
//   H = mod(H,1.0);
//   float R = abs(H * 6.0 - 3.0) - 1.0;
//   float G = 2.0 - abs(H * 6.0 - 2.0);
//   float B = 2.0 - abs(H * 6.0 - 4.0);
//   return clamp(vec3(R,G,B),0.0,1.0);
// }

// vec3 HSLtoRGB(vec3 HSL){
//   vec3 RGB = HUEtoRGB(HSL.x);
//   float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
//   return (RGB - 0.5) * C + HSL.z;
// }

// void main() {
//   vec4 diffuseColor = texture2D( map, vUv );
//   gl_FragColor = vec4( diffuseColor.xyz * HSLtoRGB(vec3(vScale/5.0, 1.0, 0.5)), diffuseColor.w );

//   if ( diffuseColor.w < 0.5 ) discard;
// }`,

  init: function () {
    var positionX;
    var positionY;
    var positionZ;
    var sign;
    var particlesNumber = this.data.particlesNumber;

    var geometry = this.initQuadGeometry();
    // var shader = this.initQuadShader();
    // geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  
    const textureLoader = new THREE.TextureLoader();

				const assignSRGB = ( texture ) => {

					texture.colorSpace = THREE.SRGBColorSpace;

				};

				const sprite1 = textureLoader.load( 'http://servicemedia.s3.amazonaws.com/assets/pics/sparkle.png', assignSRGB );
    // const material = new THREE.PointsMaterial({ size: this.data.size, map: sprite1, blending: THREE.AdditiveBlending, transparent: true, vertexColors: true });
    const material = new THREE.SpriteMaterial( { map: sprite1, color: 0xffffff } );
    var mesh = this.instancedMesh = new THREE.InstancedMesh(geometry, material, particlesNumber);

    this.particlesInfo = [];
    for (var i = 0; i < particlesNumber; i++) {
      sign = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
      positionX = sign * Math.random();
      sign = Math.floor(Math.random() * 2) === 0 ? 1 : -1;
      positionY = sign * Math.random();
      positionZ = 0.6 * Math.random();
      this.addParticle(positionX / 2, 1, -positionZ);
    }

    this.el.setObject3D('particleInstanced', mesh);
    console.log("tryna init particle-system-instanced with map " + this.data.src);
  },

  addParticle: function(x, y, z) {
    var mesh;
    var particleInfo = {};
    var sign = Math.floor(Math.random() * 2) === 0 ? 1 : -1;

    particleInfo.object3D = new THREE.Object3D();
    particleInfo.object3D.position.set(x, y, z);
    particleInfo.xPosition = x;
    particleInfo.xSpeed = sign * Math.random() * 0.0003;
    particleInfo.lifeTime = 0;
    this.particlesInfo.push(particleInfo);
  },

  initQuadGeometry: function () {
    var geometry = new THREE.BufferGeometry();
    var vertexCoordinateSize = 3; // 3 floats to represent x,y,z coordinates.

    var quadSize = this.data.particleSize;
    var quadHalfSize = quadSize / 2.0;

    var uvCoordinateSize = 2; // 2 float to represent u,v coordinates.
    // No indexed
    var positions = [
      // Top left triangle
      quadHalfSize, quadHalfSize, 0.0,
      -quadHalfSize, quadHalfSize, 0.0,
      -quadHalfSize, -quadHalfSize, 0.0,
      // Bottom right triangle
      -quadHalfSize, -quadHalfSize, 0.0,
      quadHalfSize, -quadHalfSize, 0.0,
      quadHalfSize, quadHalfSize, 0.0
    ];

    var uvs = [
      1, 1,
      0, 1,
      0, 0,

      0, 0,
      1, 0,
      1, 1,
    ];

    var visible = Array(this.data.particlesNumber).fill(0.0);

    var visibleAttribute = this.visibleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(visible), 1);

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, vertexCoordinateSize));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, uvCoordinateSize));
    geometry.setAttribute('visible', visibleAttribute);
    return geometry;
  },

  tick: function (time, delta) {
    var geometry;
    var positions;
    var particleInfo;
    var particleSpeed = this.data.particleSpeed;

    this.lastParticleDelta = this.lastParticleDelta || 0;
    this.lastParticleDelta += delta;
    for (var i = 0; i < this.particlesInfo.length; i++) {
      particleInfo = this.particlesInfo[i];
      particleInfo.particleLifeTime -= delta;

      // Reset and hide particle.
      if (particleInfo.particleLifeTime < 0) {
        particleInfo.particleLifeTime = 0;
        this.el.emit('particleended');
        this.visibleAttribute.setX(i, 0.0);
      }

      particleInfo.object3D.position.y -= particleSpeed;
      particleInfo.object3D.position.x += particleInfo.xSpeed;
      particleInfo.object3D.updateMatrix();
      this.instancedMesh.setMatrixAt(i, particleInfo.object3D.matrix);
    }

    // Emit a new particle
    if (this.lastParticleDelta > this.data.particleRate) {
      for (var i = 0; i < this.particlesInfo.length; i++) {
        particleInfo = this.particlesInfo[i];

        // Skip if the particle is in use.
        if (particleInfo.particleLifeTime) { continue; }

        particleInfo.particleLifeTime = this.data.particleLifeTime;
        particleInfo.object3D.position.y = 1;
        particleInfo.object3D.position.x = particleInfo.xPosition;
        particleInfo.object3D.updateMatrix();

        this.visibleAttribute.setX(i, 1.0);
        this.el.emit('particlestarted');
        this.instancedMesh.setMatrixAt(i, particleInfo.object3D.matrix);
        break;
      }
      this.lastParticleDelta = 0;
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.visibleAttribute.needsUpdate = true;
  }

  // update: function (oldData) {
  //   if (oldData.src !== this.data.src) { this.loadTextureImage(); }
  // },

  // loadTextureImage: function () {
  //   var src = this.data.src;
  //   var self = this;
  //   this.el.sceneEl.systems.material.loadTexture(src, {src: src}, function textureLoaded (texture) {
  //     self.el.sceneEl.renderer.initTexture(texture);
  //     texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  //     texture.magFilfer = THREE.LinearFilter;
  //     self.shader.uniforms.uMap.value = texture;
  //   });
  // },

  // initQuadShader: function() {
  //   var uniforms = {
  //     uMap: {type: 't', value: null}
  //   };
  //   var shader = this.shader = new THREE.ShaderMaterial({
  //     uniforms: uniforms,
  //     vertexShader: this.vertexShader,
  //     fragmentShader: this.fragmentShader,
  //     transparent: true
  //   });
  //   return shader;
  // }
});