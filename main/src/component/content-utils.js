
AFRAME.registerComponent('listen-from-camera', { //attached to cam entity, update the scene listener to cam position every tick
  init: function () {
  },
  tick: function(time, deltaTime) {
      if (Howler != null) {  
          camPosition = this.el.object3D.position; //for spatialization
          // console.log("camPosition: " + JSON.stringify(camPosition))
          Howler.pos(camPosition.x, camPosition.y, camPosition.z);
      }
  }
}); //end register


AFRAME.registerComponent('basic-link', {
  schema: {
    href: {default: ''},
    // href: {default: ''},
  },
  init: function() {
    this.el.addEventListener('mousedown', (e)=> { //TODO turn off if parent is freaking invisible!!!!
      
      if (this.data.href != undefined && this.data.href.length > 5) {
        console.log("basic link click for href " + this.data.href);
      //  window.location = this.data.href;
       var a = document.createElement('a');
        a.target="_blank";
        a.href=this.data.href;
        a.click();
      }
    })
  }
});
AFRAME.registerComponent('basic-scene-link', {
  schema: {
    href: {default: ''},
    // href: {default: ''},
  },
  init: function() {
    this.el.addEventListener('mousedown', (e)=> { // turn off if parent is freaking invisible!!!!
      console.log("basic scene link click for scene href " + this.data.href);
      if (this.data.href != undefined && this.data.href.length > 5) {
      //  window.location = this.data.href;
       var a = document.createElement('a');
        a.href=this.data.href;
        a.click();
        // window.location.href = this.data.href;
      }
    })
  }
});

AFRAME.registerComponent('play-on-window-click', { //play videosphere
  init: function () {
    this.onClick = this.onClick.bind(this);
  },
  play: function () {
    window.addEventListener('click', this.onClick);
  },
  pause: function () {
    window.removeEventListener('click', this.onClick);
  },
  onClick: function (evt) {
    var video = this.el.components.material.material.map.image;
    if (!video) { return; }
    video.play();
  }
});

AFRAME.registerComponent('play-on-vrdisplayactivate-or-enter-vr', { //play videosphere in vr mode
  init: function () {
    this.playVideo = this.playVideo.bind(this);
    this.playVideoNextTick = this.playVideoNextTick.bind(this); 
  },
  play: function () {
    window.addEventListener('vrdisplayactivate', this.playVideo);
    this.el.sceneEl.addEventListener('enter-vr', this.playVideoNextTick);
  },
  pause: function () {
    this.el.sceneEl.removeEventListener('enter-vr', this.playVideoNextTick);
    window.removeEventListener('vrdisplayactivate', this.playVideo);
  },
  playVideoNextTick: function () {
    setTimeout(this.playVideo);
  },
  playVideo: function () {
    var video = this.el.components.material.material.map.image;
    if (!video) { return; }
    video.play();
  }
});
// AFRAME.registerComponent('screenshot', {

  // document.querySelector('a-scene').components.screenshot.capture('perspective');

// });

AFRAME.registerComponent('main-text-control', {
    schema: {
        mainTextString: {default: ''},
        mode: {default: ""}
      },
      init: function () {
        let textArray = [];
        let index = 0;  
        let nextButton = document.getElementById("nextMainText");
        let previousButton = document.getElementById("previousMainText");
        let mainTextHeader = document.getElementById("mainTextHeader");
        if (this.data.mainTextString != undefined) {
            
            if (this.data.mode == "Paged" && this.data.mainTextString.length > 400) { //pagination!
              // console.log(this.data.mainTextString);
              let indexes = [];  //array for split indexes;
              let lastIndex = 0;
              let wordSplit = this.data.mainTextString.split(" ");
              for (let i = 0; i < this.data.mainTextString.length - 1; i++) {
                if (i == 400 + lastIndex) {
                  lastIndex = this.data.mainTextString.indexOf(' ', i); //get closest space to char count
                  indexes.push(lastIndex);
                }
              }
              for (let s = 0; s < indexes.length; s++) {
                if (s == 0) {
                  textArray.push(this.data.mainTextString.substring(0, indexes[s]));
                  
                } else {
                let chunk = this.data.mainTextString.substring(indexes[s], indexes[s+1]);
                console.log("tryna push chunck: " + chunk);
                textArray.push(chunk);
                }
              }
            // }

            } else { //if mode == "split"
              textArray = this.data.mainTextString.split("~"); //TODO scroll
            }      
            
            // console.log(JSON.stringify(textArray));

            
            this.textArray = textArray;
            // tArray.length = this.textArray.length;

            document.querySelector("#mainText").setAttribute('text', {
                baseline: "top",
                align: "left",
                value: this.textArray[0]
            });

            // console.log("mainTextString: " + textArray[0]);

            if (this.textArray.length > 1) {
              mainTextHeader.setAttribute('visible', true);
              mainTextHeader.setAttribute('text', {
                  baseline: "top",
                  align: "left",
                  value: "page 1 of " + textArray.length 
              });
              nextButton.setAttribute('visible', true);
              previousButton.setAttribute('visible', true);
              let uiMaterial = new THREE.MeshStandardMaterial( { color: '#63B671' } ); 
              nextButton.addEventListener('model-loaded', () => {
                const obj = nextButton.getObject3D('mesh');
                obj.traverse(node => {
                  node.material = uiMaterial;
                  });
                });
              previousButton.addEventListener('model-loaded', () => {
                const obj = previousButton.getObject3D('mesh');
                obj.traverse(node => {
                  node.material = uiMaterial;
                });
              });  

                nextButton.addEventListener('mousedown', function () {
                    if (textArray.length > index + 1) {
                        index++;
                    } else {
                        index = 0;
                    }
                    // console.log(textArray[index]);
                    document.querySelector("#mainText").setAttribute('text', {
                      baseline: "top",
                      align: "left",
                        value: textArray[index]
                    });
                    mainTextHeader.setAttribute('text', {
                      baseline: "top",
                      align: "left",
                      value: "page "+(index+1)+" of " + textArray.length
                    });
                });

                previousButton.addEventListener('mousedown', function () {
                  if (index > 0) {
                      index--;
                  } else {
                      index = textArray.length - 1;
                  }
                  // console.log(textArray[index]);
                  document.querySelector("#mainText").setAttribute('text', {
                    baseline: "top",
                    align: "left",
                      value: textArray[index]
                  });
                  mainTextHeader.setAttribute('text', {
                    baseline: "top",
                    align: "left",
                    value: "page "+(index+1)+" of " + textArray.length
                  });
              });
            }
        }
    }
});

AFRAME.registerComponent('toggle-main-text', {
    schema: {
        mainTextString: {default: ''},
      },
      init: function () {
        this.el.addEventListener('model-loaded', () => {
        // // Grab the mesh / scene.
        // let nextButton = document.getElementById("nextMainText");
        // let previousButton = document.getElementById("previousMainText");
        const obj = this.el.getObject3D('mesh');
        this.material = new THREE.MeshStandardMaterial( { color: '#63B671' } ); 
        obj.traverse(node => {
          node.material = this.material;
          });
        });
        // const nextObj = document.getElementById("nextMainText").getObject3D('mesh');
        // nextObj.traverse(node => {
        //   node.material = material;
        // });
        // const previousObj = document.getElementById("previousMainText").getObject3D('mesh');
        // previousObj.traverse(node => {
        //   node.material = material;
        // });

        this.el.addEventListener('mousedown', function () {
         

          if (!document.querySelector("#mainTextPanel").getAttribute('visible')){
            document.querySelector("#mainTextPanel").setAttribute('visible', true);
            // const nextObj = document.getElementById("nextMainText").getObject3D('mesh');
            // nextObj.traverse(node => {
            //   node.material = this.material;
            // });
            // const previousObj = document.getElementById("previousMainText").getObject3D('mesh');
            // previousObj.traverse(node => {
            //   node.material = this.material;
            // });
            // this.el.setAttribute('material', 'color', 'green');
            // console.log('tryna toggle main text panel ' + document.querySelector("#mainTextPanel"));
          } else {
            document.querySelector("#mainTextPanel").setAttribute('visible', false);
          }

        });
    }
});

let attributionsArray = [];
let attributionsIndex = 0;
AFRAME.registerComponent('attributions-text-control', {

    schema: {
      jsonData: {
        parse: JSON.parse,
        stringify: JSON.stringify
      }
    },
    init: function () {
      // let attributionParams = document.querySelector(".attributionParams").id;
      // console.log("gotsome jsonData re " + JSON.stringify(this.data.jsonData));
      let tArray = this.data.jsonData.attributions; //must use a declared name for array, raw array doesn't work
      attributionsArray = tArray; //for toggle component below
      // this.attributionsObject = attributions; //take from 
      // console.log("attributionsObject " + JSON.stringify(this.attributionsObject));
      // console.log("attributiosn length: " + tArray.length);
      attributionsIndex = 0;  
      if (tArray != undefined) {       
          this.tArray = tArray;
          // tArray.length = tArray.length;
          let headerEl = document.getElementById("attributionsHeaderText");
          let sourceEl = document.getElementById("attributionsSourceText");
          let authorEl = document.getElementById("attributionsAuthorText");
          let licenseEl = document.getElementById("attributionsLicenseText");
          let modsEl = document.getElementById("attributionsModsText");
          let nextButton = document.getElementById("nextAttribution");
          let previousButton = document.getElementById("previousAttribution");

          headerEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Attribution 1 of " + tArray.length
          });
          sourceEl.setAttribute('text', {
              baseline: "top",
              align: "left",
              // color: "lightblue",
              value: "Source: " + tArray[0].sourceTitle
          });
          // if (tArray[0].sourceLink != undefined && tArray[0].sourceLink.length > 0) {
          //   sourceEl.setAttribute('basic-link', {href: tArray[0].sourceLink});
          // }
          authorEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            // color: "lightblue",
            value: "Author: " + tArray[0].authorName
          });
          // if (tArray[0].authorLink != undefined && tArray[0].authorLink.length > 0) {
          //     authorEl.setAttribute('basic-link', {href: tArray[0].authorLink});
          // }
          
          licenseEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            value: "License: " + tArray[0].license
          });
          licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
          let mods = tArray[0].modifications.toLowerCase().includes("undefined") ? "none" : tArray[0].modifications;
          modsEl.setAttribute('text', {
            baseline: "top",
            align: "left",
            value: "Mods: " + mods
          });

          if (tArray.length > 1) {
            nextButton.setAttribute('visible', true);
            previousButton.setAttribute('visible', true);
            nextButton.setAttribute('visible', true);
            previousButton.setAttribute('visible', true);
            let uiMaterial = new THREE.MeshStandardMaterial( { color: 'blue' } ); 
            nextButton.addEventListener('model-loaded', () => {
              const obj = nextButton.getObject3D('mesh');
              obj.traverse(node => {
                node.material = uiMaterial;
                });
              });
            previousButton.addEventListener('model-loaded', () => {
              const obj = previousButton.getObject3D('mesh');
              obj.traverse(node => {
                node.material = uiMaterial;
              });
            });  
          }
          previousButton.addEventListener('mousedown', function () {
            console.log("tryna show previous from index" + attributionsIndex);
            if (attributionsIndex > 0) {
                  attributionsIndex--;
              } else {
                attributionsIndex = tArray.length - 1;
              }
              headerEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Attribution "+(attributionsIndex+1)+" of " + tArray.length
              });
              sourceEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Source: " + tArray[attributionsIndex].sourceTitle
              });
              if (tArray[attributionsIndex].sourceLink != undefined && tArray[attributionsIndex].sourceLink.length > 0) {
                sourceEl.setAttribute('basic-link', {href: tArray[attributionsIndex].sourceLink});
              } else {
                sourceEl.setAttribute('basic-link', {href: "no"});
                sourceEl.removeAttribute('basic-link', true);
              }
              authorEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Author: " + tArray[attributionsIndex].authorName
              });
              if (tArray[attributionsIndex].authorLink != undefined && tArray[attributionsIndex].authorLink.length > 0) {
                authorEl.setAttribute('basic-link', {href: tArray[attributionsIndex].authorLink});
              } else {
                console.log("removing link");
                authorEl.setAttribute('basic-link', {href: "no"});
                authorEl.removeAttribute('basic-link', true);
              }
              licenseEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "License: " + tArray[attributionsIndex].license
              });
              licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
              modsEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "Mods: " + tArray[attributionsIndex].modifications
              });
          });          
          nextButton.addEventListener('mousedown', function () {
            console.log("tryna show next from index" + attributionsIndex);
            if (tArray.length > attributionsIndex + 1) {
                  attributionsIndex++;
              } else {
                attributionsIndex = 0;
              }
              headerEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Attribution "+ (attributionsIndex+1) +" of " + tArray.length
              });
              sourceEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Source: " + tArray[attributionsIndex].sourceTitle
              });
              if (tArray[attributionsIndex].sourceLink != undefined && tArray[attributionsIndex].sourceLink.length > 4) {
                sourceEl.setAttribute('basic-link', {href: tArray[attributionsIndex].sourceLink});
              } else {
                console.log("removing link");
                sourceEl.setAttribute('basic-link', {href: "no"}); //try to override to force it
                sourceEl.removeAttribute('basic-link', true);
              }
              authorEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                // color: "lightblue",
                value: "Author: " + tArray[attributionsIndex].authorName
              });
              if (tArray[attributionsIndex].authorLink != undefined && tArray[attributionsIndex].authorLink.length > 0) {
                authorEl.setAttribute('basic-link', {href: tArray[attributionsIndex].authorLink});
              } else {
                console.log("removing link");
                authorEl.setAttribute('basic-link', {href: "no"});
                authorEl.removeAttribute('basic-link', true);
              }
              licenseEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "License: " + tArray[attributionsIndex].license
              });
              licenseEl.setAttribute('basic-link', {href: "https://creativecommons.org/licenses"});
              modsEl.setAttribute('text', {
                baseline: "top",
                align: "left",
                value: "Mods: " + tArray[attributionsIndex].modifications
              });
          });
      }
  }
});

AFRAME.registerComponent('toggle-attributions-text', {
  schema: {
      mainTextString: {default: ''},
    },
    init: function () {
      this.el.addEventListener('model-loaded', () => {
        const obj = this.el.getObject3D('mesh');
        this.material = new THREE.MeshStandardMaterial( { color: 'blue' } ); 
        obj.traverse(node => {
          node.material = this.material;
          });
        });
      
      let sourceEl = document.getElementById("attributionsSourceText");
      let authorEl = document.getElementById("attributionsAuthorText");
      this.el.addEventListener('mousedown', function () {
        if (!document.querySelector("#attributionsTextPanel").getAttribute('visible')){
          document.querySelector("#attributionsTextPanel").setAttribute('visible', true);
          if (attributionsArray[attributionsIndex].sourceLink != undefined && attributionsArray[attributionsIndex].sourceLink.length > 0) {
            sourceEl.setAttribute('basic-link', {href: attributionsArray[attributionsIndex].sourceLink});
          }
          if (attributionsArray[attributionsIndex].authorLink != undefined && attributionsArray[attributionsIndex].authorLink.length > 0) {
            authorEl.setAttribute('basic-link', {href: attributionsArray[attributionsIndex].authorLink});
          }
          
        } else {
          document.querySelector("#attributionsTextPanel").setAttribute('visible', false);
          sourceEl.setAttribute('basic-link', {href: "no"});
          authorEl.setAttribute('basic-link', {href: "no"}); //the only way!?!
        }

      });
  }
});


let availableScenesIndex = 0;
let scenesArray = [];
AFRAME.registerComponent('available-scenes-control', {
  schema: {
    jsonData: {
      parse: JSON.parse,
      stringify: JSON.stringify
      }
    },
    init: function () {
      
      scenesArray = this.data.jsonData.availableScenes; 
      // console.log(JSON.stringify(scenesArray));
      let availableScenePicEl = document.getElementById("availableScenePic");
      let nextButton = document.getElementById("availableScenesNextButton");
      let previousButton = document.getElementById("availableScenesPreviousButton");
      availableScenesIndex = 0;  
      if (scenesArray != undefined && scenesArray.length > 0) {        
        let uiMaterial = new THREE.MeshStandardMaterial( { color: 'gold' } ); 
        let headerEl = document.getElementById("availableScenesHeaderText");
        headerEl.setAttribute('text', {
          baseline: "top",
          align: "left",
          // color: "lightblue",
          value: "Scene: " + scenesArray[availableScenesIndex].sceneTitle + "\n" + "Code: " + scenesArray[availableScenesIndex].sceneKey  + "\n" + "By: " + scenesArray[availableScenesIndex].sceneOwner + "\n" + "Keynote: " + scenesArray[availableScenesIndex].sceneKeynote+ "\n" + "Description: " + scenesArray[availableScenesIndex].sceneDescription 
        });
      // let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
      // availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
     
      // console.log("gotsome jsonData re " + JSON.stringify(scenesArray));
      var loader = new THREE.TextureLoader();
      // load a resource
      loader.load(
        // resource URL
        scenesArray[availableScenesIndex].scenePostcardHalf, //make sure first one is preloaded
        // onLoad callback
        function ( texture ) { 
          texture.encoding = THREE.sRGBEncoding; 
          texture.flipY = false; 
          // in this example we create the material when the texture is loaded
          var material = new THREE.MeshBasicMaterial( {
            map: texture
           } );
           let obj = availableScenePicEl.getObject3D('mesh');  
           obj.traverse(node => { //needs a callback here to insure it gets painted the first time
            node.material = material;
          });
        },
        function ( err ) {
          console.error( 'An error happened.' );
        }
      );
      this.el.addEventListener('toggleOnAvailableScenes', function (event) {
        console.log('toggleOnPicGroup event detected with', event.detail);
        let mesh = pictureGroupPicEl.getObject3D('mesh');
        this.href = picGroupArray[0].images[0].url;
        console.log("tryna load initial scene pic " + this.href);
        this.texture = null;
        this.material = null;
        // const obj = pictureGroupPicEl.getObject3D('mesh');
        var loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
          // resource URL
          scenesArray[availableScenesIndex].scenePostcardHalf, //make sure first one is preloaded
          // onLoad callback
          function ( texture ) { 
            texture.encoding = THREE.sRGBEncoding; 
            texture.flipY = false; 
            // in this example we create the material when the texture is loaded
            var material = new THREE.MeshBasicMaterial( {
              map: texture
             } );
             let obj = availableScenePicEl.getObject3D('mesh');  
             obj.traverse(node => { //needs a callback here to insure it gets painted the first time
              node.material = material;
            });
          },
          function ( err ) {
            console.error( 'An error happened.' );
          }
        );
      });


      nextButton.addEventListener('model-loaded', () => {
        const obj = nextButton.getObject3D('mesh');
        obj.traverse(node => {
          node.material = uiMaterial;
          });
          // let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey; //wait so link isn't hot till visible
          let sceneHref = "";
          availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});   
        });

      nextButton.addEventListener('mousedown', function () {

        console.log("tryna show next from index" + availableScenesIndex);
        if (scenesArray.length > availableScenesIndex + 1) {
          availableScenesIndex++;
          } else {
          availableScenesIndex = 0;
        }
        let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
        availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
        headerEl.setAttribute('text', {
          baseline: "top",
          align: "left",
          // color: "lightblue",
          value: "Scene: " + scenesArray[availableScenesIndex].sceneTitle + "\n" + "Code: " + scenesArray[availableScenesIndex].sceneKey  + "\n" + "By: " + scenesArray[availableScenesIndex].sceneOwner + "\n" + "Keynote: " + scenesArray[availableScenesIndex].sceneKeynote+ "\n" + "Description: " + scenesArray[availableScenesIndex].sceneDescription 
        });
        const obj = availableScenePicEl.getObject3D('mesh');
        const href = scenesArray[availableScenesIndex].scenePostcardHalf;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
      });

      previousButton.addEventListener('model-loaded', () => {
        const obj = previousButton.getObject3D('mesh');
        obj.traverse(node => {
          node.material = uiMaterial;
          });
        });
      previousButton.addEventListener('mousedown', function () {
        console.log("tryna show next from index" + availableScenesIndex);
        if (availableScenesIndex > 0) {
          availableScenesIndex--;
        } else {
          availableScenesIndex = scenesArray.length - 1;
        }

        let sceneHref = "/webxr/" + scenesArray[availableScenesIndex].sceneKey;
        availableScenePicEl.setAttribute('basic-scene-link', {href: sceneHref});
        headerEl.setAttribute('text', {
          baseline: "top",
          align: "left",
          // color: "lightblue",
          value: "Scene: " + scenesArray[availableScenesIndex].sceneTitle + "\n" + "Code: " + scenesArray[availableScenesIndex].sceneKey  + "\n" + "By: " + scenesArray[availableScenesIndex].sceneOwner + "\n" + "Keynote: " + scenesArray[availableScenesIndex].sceneKeynote+ "\n" + "Description: " + scenesArray[availableScenesIndex].sceneDescription 
        });
        const obj = availableScenePicEl.getObject3D('mesh');
        const href = scenesArray[availableScenesIndex].scenePostcardHalf;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
      });
      availableScenePicEl.addEventListener('model-loaded', () => {
        // Grab the mesh / scene.
        const obj = availableScenePicEl.getObject3D('mesh');
        const href = scenesArray[0].scenePostcardHalf;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
        });
      }
    }
});
AFRAME.registerComponent('toggle-available-scenes', {
  schema: {
      mainTextString: {default: ''},
    },
    init: function () {
      this.el.addEventListener('model-loaded', () => {
        const obj = this.el.getObject3D('mesh');
        this.material = new THREE.MeshStandardMaterial( { color: 'gold' } ); 
        obj.traverse(node => {
          node.material = this.material;
          });
        });
      
      let scenesPanelEl = document.getElementById("availableScenesPanel");
      this.el.addEventListener('mousedown', function () {
        console.log("scenePanel visible " + scenesPanelEl.getAttribute('visible'));
        if (!scenesPanelEl.getAttribute('visible')){
          
          scenesPanelEl.setAttribute('visible', true);
          // // console.log(scenesPanelEl.getAttribute('available-scenes-control', jsonData.availableScenes));
          // // console.log(scenesArray);
          // var scene = scenesArray[Math.floor(Math.random() * scenesArray.length)];
          let sceneHref = "/webxr/" + scenesArray[0].sceneKey;
          console.log(sceneHref);
          document.getElementById("availableScenePic").setAttribute('basic-scene-link', {href: sceneHref});
          
        } else {
          scenesPanelEl.setAttribute('visible', false);

        }

      });
  }
});

AFRAME.registerComponent('mod-model', {
  schema: {
      eventData: {default: ''},
    },
    init: function () {
      let eventData = [];
      if (this.data.eventData.length > 1) {
        eventData = this.data.eventData.split("~");//tilde delimiter splits string to array
      }
      this.isInitialized = false; //to prevent model-loaded from retriggering when childrens are added to this parent
      this.el.addEventListener('model-loaded', () => {
      if (!this.isInitialized) {
        this.bubble = null;
        this.bubbleText = null;
        this.isInitialized = true;
        this.meshChildren = [];
        let theEl = this.el;
        const obj = this.el.getObject3D('mesh');
        let worldPos = null;
        let = hasAnims = false;
        let camera = AFRAME.scenes[0].camera; //better for THREE operations than querySelector, they say...
        let mixer = new THREE.AnimationMixer( obj );
        let clips = obj.animations;
        let moIndex = -1;
        let idleIndex = -1;
        let walkIndex = -1;
        let runIndex = -1;

        for (i = 0; i < clips.length; i++) { //get reference to all anims
          hasAnims = true;
          console.log("model has animation: " + clips[i].name);
          if (clips[i].name.includes("mouthopen")) {
            moIndex = i;
          }
          if (clips[i].name.includes("mouthopen")) {
            moIndex = i;
          }
          if (clips[i].name.toLowerCase().includes("mixamo.com_armature_0")) {
            idleIndex = i;
          }
          if (clips[i].name.toLowerCase().includes("take 001")) {
            idleIndex = i;
          }
          if (clips[i].name.toLowerCase().includes("idle")) {
            idleIndex = i;
          }
        }
        if (hasAnims) {
          if (this.data.eventData.includes("loop_all_anims")) {
            theEl.setAttribute('animation-mixer', {
              "loop": "repeat",
            });
          }
          if (idleIndex != -1) {
            theEl.setAttribute('animation-mixer', {
              "clip": clips[idleIndex].name,
              "loop": "repeat",
            });
          }
        }

        obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"
          this.nodeName = node.name;
          if (this.data.eventData.includes("eyelook") && this.nodeName.includes("eye")) { //must be set in the data and as a name on the model
            if (node instanceof THREE.Mesh) {
            this.meshChildren.push(node);
            console.log("gotsa eye!");
            }
          }


        });
        for (i = 0; i < this.meshChildren.length; i++) { //apply mods to the special things
          console.log("meshChild" + JSON.stringify(this.meshChildren[i].name));
          if (this.meshChildren[i].name.includes("eye")) {
            console.log("gotsa eye too!");
            let child = this.el.object3D.getObjectByName(this.meshChildren[i].name, true);
            if (child != null) { 
              let box = new THREE.Box3().setFromObject(child); //bounding box for position
              let center = new THREE.Vector3();
              box.getCenter(center); //get centerpoint of eye child geometry, in localspace
              child.geometry.center(); //reset pivot of eye geo
              child.position.set(0,0,0); //clear transforms so position below won't be offset
              let theEye = document.createElement("a-entity");
              theEye.setObject3D("Object3D", child);
              theEye.setAttribute("look-at", "#player");
              this.el.appendChild(theEye); //set as child of DOM heirarchy, not just parent model
              theEye.setAttribute("position", obj.worldToLocal(center)); //set position as local to 
              // obj.updateMatrix();
              // obj.updateMatrixWorld();
          }
        }
      }
    
      if (this.el.classList.contains('target')) {
        let textIndex = 0;
        this.position = null;
        // let hasBubble = false;
        // let theEl = this.element;
        let hasCallout = false;
        if (!this.data.eventData.toLowerCase().includes("undefined") && this.data.eventData.toLowerCase().includes("main") && this.data.eventData.toLowerCase().includes("text")) {
          document.getElementById("mainTextToggle").setAttribute("visible", false);
          this.data.eventData = document.getElementById("mainText").getAttribute("main-text-control", "mainTextString"); 
          console.log(this.data.eventData);
          eventData = this.data.eventData.mainTextString.split("~");
          hasCallout = true;
        } 
        if (hasCallout) {
        let bubble = document.createElement("a-entity");
        this.bubble = bubble;
        console.log("made a bubble!" + bubble);
          bubble.setAttribute("gltf-model", "#thoughtbubble"); //just switch this for other callout types (speech and plain callout)
          bubble.setAttribute("look-at", "#player");
          this.el.appendChild(bubble);
          bubble.classList.add("bubble");
          bubble.setAttribute("position", "2 2 0");
          bubble.setAttribute("rotation", "0 0 0"); 
          bubble.setAttribute("scale", "-.5 .5 .5"); 
          // bubble.setAttribute("material", {"color": "white", "blending": "additive", "transparent": false, "alphaTest": .5});
          bubble.setAttribute("material", {"color": "white", "shader": "flat"}); //doh, doesn't work for gltfs... 
          bubble.setAttribute("visible", false);
          let bubbleText = document.createElement("a-text");
          this.bubbleText = bubbleText;
          bubbleText.classList.add("bubbleText");
          bubbleText.setAttribute("visible", false);
          bubbleText.setAttribute("position", "2 2 .1");
          bubbleText.setAttribute("scale", ".5 .5 .5"); 
          bubbleText.setAttribute("look-at", "#player");
          bubbleText.setAttribute("width", 3);
          bubbleText.setAttribute("height", 2);
          this.el.appendChild(bubbleText);
          bubble.addEventListener('model-loaded', () => {
            const bubbleObj = bubble.getObject3D('mesh');
            // var material = new THREE.MeshBasicMaterial({map: bubbleObj.material.map}); 
            // material.color = "white";
            bubbleObj.traverse(node => {
                // node.material = material;
                node.material.flatShading = true;
                node.material.needsUpdate = true
              });
            });

          setInterval(function(){ //get "viewport" position (normalized screen coords)
            let pos = new THREE.Vector3();
            pos = pos.setFromMatrixPosition(obj.matrixWorld); 
            // worldPos = pos;
            pos.project(camera);
            var width = window.innerWidth, height = window.innerHeight; 
            let widthHalf = width / 2;
            let heightHalf = height / 2;
            pos.x = (pos.x * widthHalf) + widthHalf;
            pos.y = - (pos.y * heightHalf) + heightHalf;
            pos.z = 0;
            // if (pos.x != NaN) { //does it twice because matrix set, disregard if it returns NaN :( //fixed?
            //   console.log("screen position: " + (pos.x/width).toFixed(1) + " " + (pos.y/height).toFixed(1)); //"viewport position"
            // }
            if ((pos.x/width) < .45) {
              console.log("flip left");
              bubble.setAttribute("position", "2 2 0");
              bubble.setAttribute("scale", "-.5 .5 .5"); 
              bubbleText.setAttribute("position", "2 2 .15");
            } 
            if ((pos.x/width) > .55) {
              console.log("flip right");
              bubble.setAttribute("position", "-2 2 0");
              bubble.setAttribute("scale", ".5 .5 .5"); 
              bubbleText.setAttribute("position", "-2 2 .15");
            }
            // if ((pos.y/height) < .45) {
            //   console.log("flip up");
            //   bubble.setAttribute("position", "2 2 0");
            //   bubbleText.setAttribute("position", "2 2 .1");
            // } 
            // if ((pos.y/height) > .55) {
            //   console.log("flip right");
            //   bubble.setAttribute("position", "-2 2 0");
            //   bubbleText.setAttribute("position", "-2 2 .1");
            // }
          }, 2000);
        }
        let primaryAudio = document.getElementById("primaryAudio");
        if (primaryAudio != null) {
        const primaryAudioControlParams = primaryAudio.getAttribute('primary-audio-control');

        console.log("gotsa target attach " + primaryAudioControlParams.targetattach);
        if (primaryAudioControlParams.targetattach) { //set by sceneAttachPrimaryAudioToTarget or something like that...
          document.getElementById("primaryAudioParent").setAttribute("visible", false);
          // document.getElementById("primaryAudioParent").setAttribute("position", theEl.position);
          primaryAudio.emit('targetattach', {targetEntity: this.el}, true);
          primaryAudioHowl.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
          
          this.el.addEventListener('mousedown', function () {

            this.bubble = theEl.querySelector('.bubble');
            this.bubbleText = theEl.querySelector('.bubbleText');
            if (hasCallout) {
              this.bubble.setAttribute("visible", false);
              this.bubbleText.setAttribute("visible", false);
            }
            if (!primaryAudioHowl.playing()) {
                primaryAudioHowl.play();
                console.log('...tryna play...');
                if (moIndex != -1) { //moIndex = "mouthopen"
                  theEl.setAttribute('animation-mixer', {
                    "clip": clips[moIndex].name,
                    "loop": "repeat",
                    "repetitions": 10,
                    "timeScale": 2
                  });
                  theEl.addEventListener('animation-finished', function () { //clunky but whatever - this is the "recommended way" ?!?
                    theEl.removeAttribute('animation-mixer');
                  });
                }
              } else {
                    primaryAudioHowl.pause();
                    console.log('...tryna pause...');
                }
            });        
          }
        } else {
          console.log("no primary audio found!");
        }
        this.el.addEventListener('mouseenter', function () {
          if (textIndex < eventData.length - 1) {
            textIndex++;
          } else {
            textIndex = 0;
          }
          if (hasCallout && !eventData[textIndex].toLowerCase().includes("undefined")) {
            this.bubble = theEl.querySelector('.bubble');
            this.bubbleText = theEl.querySelector('.bubbleText');
            this.bubble.setAttribute("visible", true);
            this.bubbleText.setAttribute("visible", true);
            this.bubbleText.setAttribute('text', {
              baseline: "bottom",
              align: "center",
              font: "https://cdn.aframe.io/fonts/Exo2Bold.fnt",
              anchor: "center",
              wrapCount: 20,
              color: "black",
              value: eventData[textIndex]
            });
          }
        });
      }      
    }
    });
  }
});

AFRAME.registerComponent('skybox-env-map', {
  schema: {
    enabled: {default: false},
    path: {default: ''},
    extension: {default: 'jpg'},
    format: {default: 'RGBFormat'},
    enableBackground: {default: false}
  },

  init: function () {
  this.isInitialized = false;
  this.el.addEventListener('model-loaded', () => {
    if (!this.isInitialized) { //do it once, not every time a child is loaded.
      this.isInitialized = true;
      const data = this.data;
      this.textureArray = [];
      this.envmapEl = null;
      this.pash = null;
      for (let i = 1; i < 7; i++) {
        this.envmapEl = document.querySelector("#envmap_" + i);
        if (this.envmapEl) {
        this.path = this.envmapEl.getAttribute("src");
        // console.log("envMap path " + this.path);
        this.textureArray.push(this.path);
        }
      }
      this.texture = new THREE.CubeTextureLoader().load(this.textureArray);
      this.texture.format = THREE[data.format];

      if (data.enableBackground) {
        this.el.sceneEl.object3D.background = this.texture;
      }
      this.applyEnvMap();
      this.el.addEventListener('object3dset', this.applyEnvMap.bind(this));
      }
    });
  },

  applyEnvMap: function () {
    const mesh = this.el.getObject3D('mesh');
    const envMap = this.texture;
    if (!mesh) return;
    mesh.traverse(function (node) {
      if (node.material && 'envMap' in node.material) {
      // if (node.material) {
        // console.log("tryna set envmap on " + node.material.name);
        node.material.envMap = envMap;
        node.material.envMap.intensity = 1;
        node.material.needsUpdate = true;
      }
    });
  }
});



AFRAME.registerComponent('picture-groups-control', {
  schema: {
    jsonData: {
      parse: JSON.parse,
      stringify: JSON.stringify
      }
    },

  init: function () {
    // console.log("picgroupdata: " + JSON.stringify(this.data.jsonData));
    let pictureGroupPicEl = document.getElementById("pictureGroupPic"); 
    let nextButton = document.getElementById("pictureGroupNextButton"); //get children like this instead
    let previousButton = document.getElementById("pictureGroupPreviousButton");
    let picGroupArray = this.data.jsonData; //it's an array of arrays
    let picGroup = picGroupArray[0];
    let picGroupIndex = 0;0.
    pictureGroupPicEl.addEventListener('model-loaded', () => {
      let mesh = pictureGroupPicEl.getObject3D('mesh');
      this.href = picGroupArray[0].images[0].url;
      console.log("tryna load initial scene pic " + this.href);
      this.texture = null;
      this.material = null;
      // const obj = pictureGroupPicEl.getObject3D('mesh');
      var loader = new THREE.TextureLoader();
      // load a resource
      loader.load(
        // resource URL
        this.href,
        // onLoad callback
        function ( texture ) { 
          this.texture = texture;
          this.texture.encoding = THREE.sRGBEncoding; 
          this.texture.flipY = false; 
          this.material = new THREE.MeshBasicMaterial( { map: this.texture } ); 
            
          mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
            console.log("gotsa obj + mat");
            node.material = this.material;
          });
        },
        function ( err ) {
          console.error( 'An error happened.' );
        }
      );
    });
    this.el.addEventListener('toggleOnPicGroup', function (event) {
      console.log('toggleOnPicGroup event detected with', event.detail);
      let mesh = pictureGroupPicEl.getObject3D('mesh');
      this.href = picGroupArray[0].images[0].url;
      console.log("tryna load initial scene pic " + this.href);
      this.texture = null;
      this.material = null;
      // const obj = pictureGroupPicEl.getObject3D('mesh');
      var loader = new THREE.TextureLoader();
      // load a resource
      loader.load(
        // resource URL
        this.href,
        // onLoad callback
        function ( texture ) { 
          this.texture = texture;
          this.texture.encoding = THREE.sRGBEncoding; 
          this.texture.flipY = false; 
          this.material = new THREE.MeshBasicMaterial( { map: this.texture } ); 
            
          mesh.traverse(node => { //needs a callback here to insure it gets painted the first time
            console.log("gotsa obj + mat");
            node.material = this.material;
          });
        },
        function ( err ) {
          console.error( 'An error happened.' );
        }
      );
    });
      
      nextButton.addEventListener('mousedown', function () {
        // let picGroupArray = this.data.jsonData;
        let picGroup = picGroupArray[0];
        console.log("tryna show next from index" + picGroupIndex + " of " + picGroup.images.length);
        if (picGroup.images.length > picGroupIndex + 1) {
          picGroupIndex++;
          } else {
            picGroupIndex = 0;
        }
        const obj = pictureGroupPicEl.getObject3D('mesh');
        const href = picGroupArray[0].images[picGroupIndex].url;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
      });
      previousButton.addEventListener('mousedown', function () {
        // let picGroupArray = this.data.jsonData;
        let picGroup = picGroupArray[0];
        console.log("tryna show next from index" + picGroupIndex + " of " + picGroup.images.length);
        if (picGroupIndex > 0) {
            picGroupIndex--;
          } else {
            picGroupIndex = picGroup.images.length - 1;
        }
        const obj = pictureGroupPicEl.getObject3D('mesh');
        const href = picGroupArray[0].images[picGroupIndex].url;
        console.log("tryna set texture..." + href);
        var texture = new THREE.TextureLoader().load(href);
        texture.encoding = THREE.sRGBEncoding; 
        texture.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture } ); 
        obj.traverse(node => {
          node.material = material;
        });
      });
    }
});

AFRAME.registerComponent('toggle-picture-group', {
  schema: {
      // mainTextString: {default: ''},
    },
    init: function () {
      
      this.el.addEventListener('mousedown', function () {
        console.log("tryna toggle pictureGroupPanel " + document.querySelector("#pictureGroupPanel").getAttribute('visible'));
        if (!document.querySelector("#pictureGroupPanel").getAttribute('visible')){
          document.querySelector("#pictureGroupPanel").setAttribute('visible', true);
          document.querySelector("#pictureGroupsControl").emit('toggleOnPicGroup');
        } else {
          document.querySelector("#pictureGroupPanel").setAttribute('visible', false);
        }
      });
  }
});
