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
  // function playPromise(video) {
  //   var playPromise = video.play();
  //   if (playPromise !== undefined) {
  //         playPromise.then(_ => {
  //           // Automatic playback started!
  //           // Show playing UI.
  //           // We can now safely pause video...
  //           video.pause();
  //         })
  //         .catch(error => {
  //           // Auto-play was prevented
  //           // Show paused UI.
  //           console.log("error " +error)
  //         });
  //       }
  //   }
    //////////////////////////// - VID MATERIALS EMBED
    AFRAME.registerComponent('vid_materials_embed', { 
      schema: {
        videoTitle: {default: ''},
        url: {default: ''},
        url_webm: {default: ''},
        url_mov: {default: ''},
        index: {default: ''},
        meshname: {default: ''},
        id: {default: ''},
        flipY: {default: false},
        isSkybox: {default: false}, //i.e. 360 vid //erm, try above vid_sphere
        eventData: {default: ''}
      },
      init: function () {
        console.log("video id is : " + this.data.id);
        this.video = null;
        /// ------------- cubemaap fu
        this.textureArray = [];
        this.el.classList.add("activeObjexRay");
        // for (let i = 1; i < 7; i++) {
        //   this.envmapEl = document.querySelector("#envmap_" + i);
        //   if (this.envmapEl) {
        //   this.path = this.envmapEl.getAttribute("src");
        //   this.textureArray.push(this.path);
        //   }
        // }
        // this.id = "primary_video";  //hrm, could be multiples...
        this.cmTexture = new THREE.CubeTextureLoader().load(this.textureArray);
        this.cmTexture.format = THREE.RGBFormat;
        // let video = document.getElementById(this.data.id);
        // this.video = null;
        this.video = document.getElementById(this.data.id);

        // primaryVideo = video;
        let m3u8 = '/hls/'+this.data.id;

        if (settings.sceneVideoStreams != null && settings.sceneVideoStreams.length > 0) {
          m3u8 = settings.sceneVideoStreams[0];
          this.data.videoTitle = settings.sceneTitle;
        }
        if (Hls.isSupported()) {
          // console.log("hls supported!");
          // var hls = new Hls();
          // this.hls = hls;
          // this.hls.loadSource(m3u8);
          // this.hls.attachMedia(this.video);
          // if (Hls.isSupported()) {
            // var video = document.getElementById('video');
            var hls = new Hls();
            hls.attachMedia(this.video);
            
            // bind them together
            // hls.attachMedia(video);
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
        

        // this.hls.on(Hls.Events.MANIFEST_PARSED,function() {}
        // pauseVideo(this.video);
        if (!this.data.isSkybox) {
          this.el.classList.add("video_embed");
        }
       

          console.log("tryna setup video");
          
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
              // this.vidtexture.minFilter = THREE.LinearMipmapNearestFilter;
              // this.vidtexture.magFilter = THREE.LinearMipmapNearestFilter;
              this.playmaterial = new THREE.MeshStandardMaterial( { map: this.vidtexture, side: THREE.DoubleSide, shader: THREE.FlatShading } ); 
              
              // this.playmaterial = new THREE.MeshPhongMaterial({
              //   map: this.vidtexture,
              //   // emissiveMap: this.vidtexture,
              //   side: THREE.FrontSide
              //   // emissive: 0xffffff,
              //   // emissiveIntensity: .1
              // });

              console.log("tryna bind vid material to mesh");

              // this.playmaterial.generateMipmaps = true;   
              this.playmaterial.map.needsUpdate = true;   
              this.playmaterial.needsUpdate = true;
              // this.playmaterial.format = THREE.RG;
              // if (this.screenMesh.material == null) {
                
              // }
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
              this.togglePlayPauseVideo();
              this.el.getObject3D('mesh').scale.set(200, 200, 200);
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
            } else if (this.mouseOverObject.includes("slider_background") && this.video.duration) {

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

          if (this.video != undefined) {
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