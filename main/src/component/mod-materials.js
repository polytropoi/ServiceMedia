const raycaster = new THREE.Raycaster(); //reuse this!  
const mouse = new THREE.Vector2();
let primaryVideo = null;

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
  AFRAME.registerComponent('vid_materials', { //mapped on internal geo, if no external mesh assigned
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
        flipY: {default: false}
      },
      init: function () {
        console.log("video id is : " + this.data.id);
        this.video = null;
        /// ------------- cubemaap fu
        this.textureArray = [];
        this.el.classList.add("activeObjexRay");
        for (let i = 1; i < 7; i++) {
          this.envmapEl = document.querySelector("#envmap_" + i);
          if (this.envmapEl) {
          this.path = this.envmapEl.getAttribute("src");
          this.textureArray.push(this.path);
          }
        }
        this.cmTexture = new THREE.CubeTextureLoader().load(this.textureArray);
        this.cmTexture.format = THREE.RGBFormat;
        // let video = document.getElementById(this.data.id);
        // this.video = null;
        this.video = document.getElementById(this.data.id);
        // primaryVideo = video;
        let m3u8 = '/hls/'+this.data.id;
        if (Hls.isSupported()) {
          console.log("hls supported!");
          var hls = new Hls();
          this.hls = hls;
          this.hls.loadSource(m3u8);
          this.hls.attachMedia(this.video);
        } else {
          console.log("hls.js not supported (ios?), goiing native!");
          this.video.src = m3u8;
          
        }
        // this.hls.on(Hls.Events.MANIFEST_PARSED,function() {}
        // pauseVideo(this.video);
        this.el.classList.add("video_embed");

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
          this.camera = AFRAME.scenes[0].camera; 
          this.sceneEl = document.querySelector('a-scene');
          this.scene = document.querySelector('a-scene').object3D; 
          this.meshArray = [];
          let mouseOverObject = null; 
          let hitpoint = null;
          // this.screenIsTop = false;
          this.durationtimeformat = null;
          this.fancyTimeString = "";
        
          this.mesh.traverse(node => {
            // if (node instanceof THREE.Mesh) 
              if ((node.name.toLowerCase().includes("screen") || node.name.toLowerCase().includes("hvid")) && node.material) {
                this.screenMesh = node; 

                console.log("gotsa screen mesh");
                this.meshArray.push(this.screenMesh);
                // let screenMesh = document.createElement("a-entity");
                // screenMesh.classList.add("activeObjexRay");
                // screenMesh.setObject3D("mesh", this.screenMesh);
                // // this.screenMesh.remove();
                // this.sceneEl.appendChild(screenMesh);
              } 
              // else {
              //   this.screenMesh = this.mesh;
              //   this.screenIsTop = true;
              //   console.log("screenmesh is " + this.mesh.name);
              // }
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
                
              }
              if (node.name.toLowerCase().includes("slider_begin")) {
                this.slider_begin = node; 
              }
              if (node.name.toLowerCase().includes("slider_handle")) {
                this.slider_handle = node; 
              }
              // if (this.pauseButtonMesh)
            // }
          });

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
            videoNameText.setAttribute("position", "-.3 .55 -1");
            videoNameText.setAttribute("scale", "1 1 1"); 
            // bubbleText.setAttribute("look-at", "#player");
            videoNameText.setAttribute("width", 3);
            videoNameText.setAttribute("height", 2);
            videoNameText.setAttribute('text', {
              // width: 4, 
              align: "left",
              value: "Title: "+ this.data.videoTitle,
              font: "/fonts/Exo2Bold.fnt",
              anchor: "center",
              wrapCount: 100,
              color: "white",
            });

            this.videoStatus = document.createElement("a-text");
            this.el.appendChild(this.videoStatus);
            this.videoStatus.setAttribute("position", "2.4 .55 -1");
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
          var texture = new THREE.VideoTexture( this.video );
          this.vidtexture = texture;
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
              // if (this.video.src.includes(".webm") || this.video.src.includes(".mov")) { 
              //   this.vidtexture.format = THREE.RGBAFormat; 
              //   console.log("tryna set ALPHA VIDEO TEXTURE");
              // } else {
              //   this.vidtexture.format = THREE.RGBFormat;
              // }
              this.vidtexture.flipY = this.data.flipY; 
              this.vidtexture.minFilter = THREE.NearestFilter;
              this.vidtexture.magFilter = THREE.NearestFilter;
              this.playmaterial = new THREE.MeshBasicMaterial( { map: this.vidtexture } ); 
              
              // this.playmaterial = material;
                // this.meshnode = null;
             
                // this.mesh.traverse(node => {
                //   if (node instanceof THREE.Mesh) {
                //     if (node.material != null && node.material != undefined && node.name.toLowerCase().includes("hvid")) { //TODO || "vvid"
                //       this.meshnode = node;
                //       console.log("gotsa vid material " + node.name);
                //       } 
                //     }
                // });
              // if (this.video.readyState >= 2) {
                // playVideo(this.video);
              // playVideo(this.video);
              // setTimeout(()=> { //wait a bit to make sure it's playing
              console.log("tryna bind vid material to mesh");

              this.playmaterial.map.needsUpdate = true;   
              this.playmaterial.needsUpdate = true;
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

              // if (this.video.readyState >= 2) {
              //   this.playButtonMesh.visible = true;
              // }
                // },500);
              // }
            // } //else {
              this.redmat = new THREE.MeshStandardMaterial({
                color: "red"    // red (can also use a CSS color string here)
                // flatShading: true,
              });
              this.greenmat = new THREE.MeshStandardMaterial({
                color: "lightgreen"    // red (can also use a CSS color string here)
                // flatShading: true,
              });
              this.yellowmat = new THREE.MeshStandardMaterial({
                color: "yellow"    // red (can also use a CSS color string here)
                // flatShading: true,
              });
              this.bluemat = new THREE.MeshStandardMaterial({
                color: "blue"    // red (can also use a CSS color string here)
                // flatShading: true,
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
            console.log('ray hit', this.intersection.point, this.intersection.object.name);
          if (!this.intersection.object.name.includes("hvid") &&
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
                  // this.mouseOverObject = this.intersection.object.name;      
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
      this.el.addEventListener('click', () =>  {
        
        // this.video = video;
        console.log(this.mouseOverObject + " raycaster "+ this.raycaster);
        // this.mouseOverObject = mouseOverObject;
        // this.hitpoint = hitpoint;
        // thiz.slider_handle = this.slider_handle;
        if (this.video != undefined && this.video != null) {
            this.nStart = new THREE.Vector3();
            this.nEnd = new THREE.Vector3();
            if (this.slider_begin != undefined) {
              this.slider_begin.getWorldPosition( this.nStart );
              this.slider_end.getWorldPosition( this.nEnd );
            }
            // thiz.video = this.video;
            
            if (this.raycaster != null) {
                

              if (this.mouseOverObject.includes("play") || this.mouseOverObject.includes("screen") || this.mouseOverObject.includes("hvid")) {
                console.log(this.mouseOverObject + "video paused " + this.video.paused + "video readyState " + this.video.readyState);
                if (this.video.paused) {
                  console.log("tryna play!");
                  playVideo(this.video);
                  
                  // this.isPlaying = true;
                  if (this.pauseButtonMesh != null) {
                  this.pauseButtonMesh.visible = true;
                  this.playButtonMesh.visible = false;
                  }
                  
                  this.player_status_update("playing");
                  // this.play_button.material = this.greenmat;
                  // break;
                } else {
                  // if (!this.video.paused) {
                  console.log("tryna pauyse!");
                  
                  pauseVideo(this.video);
                  // this.isPlaying = false;
                  if (this.pauseButtonMesh != null) {
                  this.pauseButtonMesh.visible = false; 
                  this.playButtonMesh.visible = true;   
                  }
                  this.player_status_update("paused");
                  // this.play_button.material = this.redmat;
                  
                  // break;
                // }
              }
              // break;
            } else if (this.mouseOverObject.includes("slider_background")) {

                    // this.slider_begin.position.y/this.slider_end.position.y 
                    let nStart = new THREE.Vector3();
                    let nEnd = new THREE.Vector3();
                    this.slider_begin.getWorldPosition( nStart );
                    this.slider_end.getWorldPosition( nEnd );
                    console.log("background hit at " + JSON.stringify(this.hitpoint));
                    let range = nEnd.x.toFixed(2) - nStart.x.toFixed(2);
                    let correctedStartValue = this.hitpoint.x.toFixed(2) - nEnd.x.toFixed(2);
                    let percentage = (((correctedStartValue * 100) / range) + 100).toFixed(2); 
                    let time = (percentage * (this.video.duration / 100)).toFixed(2);
                    // let touchPosition = (((intersects[i].point.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)) * 100) / (this.slider_end.position.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)));
                    console.log("bg touch % " + percentage +  " touchPosition " + + JSON.stringify(this.hitpoint) + " vs start " +  JSON.stringify(nStart) + " vs end " +  JSON.stringify(nEnd));
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
          } else {
            console.log("this.video is undefined!");
          }
          });
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
            this.fancyTimeString = fancyTimeFormat(this.video.currentTime)  + " / "+ fancyTimeFormat(this.video.duration)  + " : " + (this.percent * 100).toFixed(2) +" %";
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
    /*
   //////////////////////////// - VID MATERIALS EMBED
   AFRAME.registerComponent('vid_materials_embed_old', { //nope, gotta to use the raycast intersect mode or no VR :( 
    schema: {
      videoTitle: {default: ''},
      url: {default: ''},
      url_webm: {default: ''},
      url_mov: {default: ''},
      index: {default: ''},
      meshname: {default: ''},
      id: {default: ''},
      flipY: {default: false}
    },
    init: function () {
      console.log("video id is : " + this.data.id);
      /// ------------- cubemaap fu
      this.textureArray = [];
      this.el.classList.add("activeObjexRay");
      for (let i = 1; i < 7; i++) {
        this.envmapEl = document.querySelector("#envmap_" + i);
        if (this.envmapEl) {
        this.path = this.envmapEl.getAttribute("src");
        this.textureArray.push(this.path);
        }
      }
      this.cmTexture = new THREE.CubeTextureLoader().load(this.textureArray);
      this.cmTexture.format = THREE.RGBFormat;
      let video = document.getElementById(this.data.id);
      let m3u8 = '/hls/'+this.data.id;
      if (Hls.isSupported()) {
        console.log("hls supported!");
        var hls = new Hls();
        this.hls = hls;
        this.hls.loadSource(m3u8);
        this.hls.attachMedia(video);
      } else {
        console.log("hls.js not supported (ios?), goiing native!");
        video.src = m3u8;
        
      }
      // this.hls.on(Hls.Events.MANIFEST_PARSED,function() {}
      this.video = video;
      this.el.classList.add("video_embed");
      this.video.addEventListener( 'canplay', this.videoSetup(), false); //next step when kinda loaded
    },
    videoSetup: function () {
        console.log("tryna setup video");
        // this.hls.on(Hls.Events.MEDIA_ATTACHED,function() {
        this.mesh = this.el.getObject3D('Object3D');
        this.screenMesh = null; 
        this.ffwdMesh = null; 
        this.rewindMesh = null; 
        this.isInitialized = false;
        let playButtonMesh = null;
        let pauseButtonMesh = null;
        this.playButtonMesh = null;
        this.pauseButtonMesh = null;
        this.pausematerial = null;
        this.playmaterial = null;
        this.slider_end = null;
        this.slider_begin = null;
        this.slider_handle = null;
        this.texture = null;
        this.durationtimeformat = 0;
        this.percent = 0;
        this.camera = AFRAME.scenes[0].camera; 
        this.sceneEl = document.querySelector('a-scene');
        this.scene = document.querySelector('a-scene').object3D; 
        this.meshArray = [];

        this.mesh.traverse(node => {
          // if (node instanceof THREE.Mesh) {
            if (node.name.toLowerCase().includes("screen")) {
              this.screenMesh = node; 

              console.log("gotsa screen mesh");
              this.meshArray.push(this.screenMesh);
              // let screenMesh = document.createElement("a-entity");
              // screenMesh.classList.add("activeObjexRay");
              // screenMesh.setObject3D("mesh", this.screenMesh);
              // // this.screenMesh.remove();
              // this.sceneEl.appendChild(screenMesh);


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
           
            if (node.name.toLowerCase().includes("pause")) {
              this.pauseButtonMesh = node; 
              // this.pauseButtonMesh.visible = false;
              this.meshArray.push(this.pauseButtonMesh);
            }
            if (node.name.toLowerCase().includes("slider_end")) {
              this.slider_end = node; 
              
            }
            if (node.name.toLowerCase().includes("slider_begin")) {
              this.slider_begin = node; 
            }
            if (node.name.toLowerCase().includes("slider_handle")) {
              this.slider_handle = node; 
            }
            // if (this.pauseButtonMesh)
          // }
        });

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
          videoNameText.setAttribute("position", "-.3 .55 -1");
          videoNameText.setAttribute("scale", "1 1 1"); 
          // bubbleText.setAttribute("look-at", "#player");
          videoNameText.setAttribute("width", 3);
          videoNameText.setAttribute("height", 2);
          videoNameText.setAttribute('text', {
            // width: 4, 
            align: "left",
            value: "Title: "+ this.data.videoTitle,
            font: "/fonts/Exo2Bold.fnt",
            anchor: "center",
            wrapCount: 100,
            color: "white",
          });

          this.videoStatus = document.createElement("a-text");
          this.el.appendChild(this.videoStatus);
          this.videoStatus.setAttribute("position", "2.4 .55 -1");
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
        var texture = new THREE.VideoTexture( this.video );
        this.vidtexture = texture;
        this.videoControl();
        // setTimeout(this.videoControl(), 1000);
      // });
      }, 
      videoControl: function () {
        console.log("videoControl init");
        // playVideo(this.video);
        //apple needs a click
          if (!this.isInitialized) {
            
            if (this.video.src.includes(".webm") || this.video.src.includes(".mov")) { 
              this.vidtexture.format = THREE.RGBAFormat; 
              console.log("tryna set ALPHA VIDEO TEXTURE");
            } else {
              this.vidtexture.format = THREE.RGBFormat;
            }
            this.vidtexture.flipY = this.data.flipY; 
            this.vidtexture.minFilter = THREE.NearestFilter;
            this.vidtexture.magFilter = THREE.NearestFilter;
            this.playmaterial = new THREE.MeshLambertMaterial( { map: this.vidtexture } ); 

            // this.playmaterial = material;
              // this.meshnode = null;
           
              // this.mesh.traverse(node => {
              //   if (node instanceof THREE.Mesh) {
              //     if (node.material != null && node.material != undefined && node.name.toLowerCase().includes("hvid")) { //TODO || "vvid"
              //       this.meshnode = node;
              //       console.log("gotsa vid material " + node.name);
              //       } 
              //     }
              // });
            // if (this.video.readyState >= 2) {
              // playVideo(this.video);
            // playVideo(this.video);
            // setTimeout(()=> { //wait a bit to make sure it's playing
            console.log("tryna bind vid material to mesh");

            this.playmaterial.map.needsUpdate = true;   
            this.screenMesh.material = this.playmaterial;
            this.isInitialized = true;
            if (this.pauseButtonMesh != null) {
              this.pauseButtonMesh.visible = false;
            }

            if (this.pauseButtonMesh != null) {
              this.playButtonMesh.visible = false;
            }

            // if (this.video.readyState >= 2) {
            //   this.playButtonMesh.visible = true;
            // }
              // },500);
            // }
          } //else {

        this.el.addEventListener('click', (event) => {  
          
            raycaster.setFromCamera( mouse, this.camera );
            this.durationtimeformat = fancyTimeFormat(this.video.duration);
            // console.log("mnouse pos " + JSON.stringify(mouse));
            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects( this.meshArray );
            // console.log(JSON.stringify(intersects));
            for ( let i = 0; i < intersects.length; i ++ ) {
              if (intersects[ i ].object.visible === true) {
                if (intersects[ i ].object.name.toLowerCase().includes("screen")) {
                  console.log("meshname clickded: " + intersects[ i ].object.name.toLowerCase());
                  console.log("isPlaying " + this.video.paused);
                  if (this.video.paused) {
                    console.log("tryna play!");
                    playVideo(this.video);
                    
                    // this.isPlaying = true;
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = true;
                    this.playButtonMesh.visible = false;
                    }
                   
                    break;
                  } else {
                    if (!this.video.paused) {
                    console.log("tryna pauyse!");
                    
                    pauseVideo(this.video);
                    // this.isPlaying = false;
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = false; 
                    }
                    
                    this.playButtonMesh.visible = true;   
                    break;
                    }
                  }
                } else if (intersects[ i ].object.name.toLowerCase().includes("play")) {
                  console.log("meshname clickded: " + intersects[ i ].object.name.toLowerCase());
                  console.log("play");
                  // if (this.video.paused) {
                  //   console.log("tryna play!");
                  //   playVideo(this.video);
                  //   this.isPlaying = true;
                  //   if (this.pauseButtonMesh != null) {
                  //   this.pauseButtonMesh.visible = true;
                  //   this.playButtonMesh.visible = false;
                  //   } 
                    
                  // }
                  if (this.video.paused) {
                    console.log("tryna play!");
                    playVideo(this.video);
                    
                    // this.isPlaying = true;
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = true;
                    this.playButtonMesh.visible = false;
                    }
                   
                    break;
                  } else {
                    if (!this.video.paused) {
                    console.log("tryna pauyse!");
                    
                    pauseVideo(this.video);
                    // this.isPlaying = false;
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = false; 
                    }
                    
                    this.playButtonMesh.visible = true;   
                    break;
                    }
                  }
                  break;
                } else if (intersects[ i ].object.name.toLowerCase().includes("pause")) {
                  console.log("meshname clickded: " + intersects[ i ].object.name.toLowerCase());
                  console.log("pause");
                  if (!this.video.paused) {
                    pauseVideo(this.video);
                    this.isPlaying = false;
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = false;
                    } 
                    this.playButtonMesh.visible = true;   
                  }
                  break;
                } else if (intersects[ i ].object.name.toLowerCase().includes("background")) {

                  // this.slider_begin.position.y/this.slider_end.position.y 
                  let nStart = new THREE.Vector3();
                  let nEnd = new THREE.Vector3();
                  this.slider_begin.getWorldPosition( nStart );
                  this.slider_end.getWorldPosition( nEnd );
                  console.log("background hit at " + JSON.stringify(intersects[i].point));
                  let range = nEnd.x.toFixed(2) - nStart.x.toFixed(2);
                  let correctedStartValue = intersects[i].point.x.toFixed(2) - nEnd.x.toFixed(2);
                  let percentage = (((correctedStartValue * 100) / range) + 100).toFixed(2); 
                  let time = (percentage * (this.video.duration / 100)).toFixed(2);
                  // let touchPosition = (((intersects[i].point.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)) * 100) / (this.slider_end.position.y.toFixed(2) - this.slider_begin.position.y.toFixed(2)));
                  console.log("bg touch % " + percentage +  " touchPosition " + + JSON.stringify(intersects[i].point) + " vs start " +  JSON.stringify(nStart) + " vs end " +  JSON.stringify(nEnd));
                  // this.slider_handle.position.x = intersects[i].point.x; 
                  // this.slider_handle.position.z =  nStart.z;
                  // this.slider_handle.position.z =  nStart.y; 
                  this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, percentage * .01);
                  this.video.currentTime = time;
                  
                  break;
              
                } else if (intersects[ i ].object.name.toLowerCase().includes("handle")) {
                    console.log("handle");
                   
                    break;
                } else if (intersects[ i ].object.name.toLowerCase().includes("fastforward")) {
                    console.log("ffwd");
                    pauseVideo(this.video);
                    if (this.video.currentTime + 10 < this.video.duration) {
                      this.video.currentTime = this.video.currentTime + 10;
                    }
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = false;
                    }
                    // if (this.pauseButtonMesh != null) {
                    this.playButtonMesh.visible = true;
                    // }
                    break;
                } else if (intersects[ i ].object.name.toLowerCase().includes("rewind")) {
                    console.log("rewind");
                    pauseVideo(this.video);
                    if (this.video.currentTime - 10 > 0) {
                      this.video.currentTime = this.video.currentTime - 10;
                    }
                    if (this.pauseButtonMesh != null) {
                    this.pauseButtonMesh.visible = false;
                    }
                    // if (this.pauseButtonMesh != null) {
                    this.playButtonMesh.visible = true;
                    // }
                    break;
                }
              }
            }
        });
        if (this.pauseButtonMesh != null) {
          this.pauseButtonMesh.visible = false;
        }
        
      },
      tick: function () {
        if (!this.video.paused && this.slider_handle != null) {
          
          this.percent = this.video.currentTime / this.video.duration;
          // console.log(this.percent);
          this.slider_handle.position.lerpVectors(this.slider_begin.position, this.slider_end.position, this.percent);

          this.videoStatus.setAttribute('text', {
            // width: 4, 
            align: "left",
            value: fancyTimeFormat(this.video.currentTime)  + " / "+ this.durationtimeformat + " : " + (this.percent * 100).toFixed(2) +" % complete",
            font: "/fonts/Exo2Bold.fnt",
            anchor: "center",
            wrapCount: 100,
            color: "white",
          });

        }
      }   
  });
  */
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


    AFRAME.registerComponent('vid_materials_ext', { //no, unused...
      schema: {
          url: {default: ''},
          url_webm: {default: ''},
          url_mov: {default: ''},
          index: {default: ''},
          meshname: {default: ''},
          flipY: {default: false}
        },
        init: function () {
       
          this.onClick = this.onClick.bind(this);
          let data = this.data;
          let playButtonMesh = null;
          // let rotation = obj.rotation
          if (data.index != null) {
            let obj = this.el.object3D.getObjectByName(this.data.meshname, true);
            // let oMesh = null;
            
            obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"            
              if (node instanceof THREE.Mesh) {
                // console.log("node name " + node.name);
                // oMesh = node;
                if (node.name.toLowerCase().includes("play")) {
                  playButtonMesh = node;
                  console.log("gotsa play button");
                }
              }
            });
          
              var video = document.createElement('video');
              video.setAttribute('src', this.data.url);
              video.setAttribute('crossorigin', 'anonymous');
              video.setAttribute('playsinline', null); //needed for ios
              var texture = new THREE.VideoTexture( video );
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;
              if (this.data.url.includes(".webm") || this.data.url.includes(".mov")) { 
                texture.format = THREE.RGBAFormat; //this needs to be a separate property
                console.log("tryna set ALPHA VIDEO TEXTURE");
              } else {
                // texture.format = THREE.RGBFormat;
                texture.format = THREE.RGBFormat;
              }
              texture.flipY = this.data.flipY; 
              var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } ); 
              obj.traverse(node => {
                  if (node.material != null && node.material != undefined) {
                    node.material = material;
                  }
              });         
              material.map.needsUpdate = true;   
              this.isPlaying = false;
              this.video = video;
  
           
                let playButton = document.createElement("a-entity");
                this.el.appendChild(playButton); 
                // playButton.classList.add("activeObjexRay");
                playButton.setObject3D("mesh", playButtonMesh);
                playButton.setAttribute('position', '0 0 0');
            

            playButton.addEventListener('model-loaded', () => {
              var texture1 = new THREE.TextureLoader().load('https://servicemedia.s3.amazonaws.com/assets/pics/playbutton.png');
              texture1.encoding = THREE.sRGBEncoding; 
              texture1.flipY = false; 
              var material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } ); 
              const obj1 = playButton.getObject3D('mesh');
              // obj1.getWorldPosition( screenPosition );
              // console.log("mesh is @ " + JSON.stringify(screenPosition) + " rot " + JSON.stringify(rotation));
              // obj1.applyQuaternion(rotation);
              obj1.traverse(node => {
                  node.material = material;
        
                });
              // obj1.applyQuaternion(rotation);
              playButton.addEventListener('mouseover', function () {
                if (triggerAudioController != null) {
                  triggerAudioController.components.trigger_audio_control.playAudio();
                }
              });
              playButton.addEventListener('click', function () {
                console.log("playButton!");
              });

              // playButton.setAttribute("scale", '.5 .5 .5');

              playButton.classList.add("activeObjexRay");  


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
    
  
    