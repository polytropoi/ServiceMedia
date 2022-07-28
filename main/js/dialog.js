let showDialogPanel = false;
let dialogInitialized = false;
let textItemArray = null;

let renderPanel = null;
let useModals = true;
let elementID = 'modalContent';
let theModal = null;
let theRenderCanvas = null;
var sceneEl = document.querySelector('a-scene');
// let metascenetype = document.querySelector('meta[name="scenetype"]').content;

// $(function() { 
if (sceneEl != null && document.querySelector('a-scene') != null) { 
  console.log("gotsa AFRAME SCENE");
  AFRAME.registerComponent('render_canvas', {   //deprecated...?
    schema: {
      initialized: {default: false},
      hello: {default: ''}
    },
    init: function(){
      var sceneEl = document.querySelector('a-scene');
      if (theRenderCanvas == null) {
        theRenderCanvas = this.el;
      }
      elementID = 'renderPanel';

      var triggerAudioController = document.getElementById("triggerAudio");
      let closeButton = document.createElement("a-entity");
      closeButton.setAttribute('gltf-model', '#square1');
      closeButton.addEventListener('model-loaded', () => {

        const obj1 = closeButton.getObject3D('mesh');
        var texture1 = new THREE.TextureLoader().load('https://servicemedia.s3.amazonaws.com/assets/pics/close_button2.png');
        texture1.encoding = THREE.sRGBEncoding; 
        texture1.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } ); 
        obj1.traverse(node => {
            node.material = material;

          });
        closeButton.addEventListener('mouseover', function () {
          if (triggerAudioController != null) {
            // triggerAudioController.components.trigger_audio_control.playAudio();
          }
        });
        closeButton.addEventListener('mousedown', function () {
          ShowHideDialogPanel();
        });
        closeButton.classList.add("activeObjexRay");  
        
        });
        closeButton.setAttribute("scale", '.05 .05 .05');
        this.el.appendChild(closeButton); 
        closeButton.setAttribute('position', '.465 .465 .05');

        let yesButton = document.createElement("a-entity");
        yesButton.setAttribute('gltf-model', '#rectangle1');
        yesButton.addEventListener('model-loaded', () => {

        const obj2 = yesButton.getObject3D('mesh');
        var texture2 = new THREE.TextureLoader().load('https://servicemedia.s3.amazonaws.com/assets/pics/yes_button1.png');
        texture2.encoding = THREE.sRGBEncoding; 
        texture2.flipY = false; 
        var material = new THREE.MeshBasicMaterial( { map: texture2, transparent: true } ); 
        obj2.traverse(node => {
            node.material = material;
          });
        });
        yesButton.setAttribute("scale", '.075 .075 .075');
        this.el.appendChild(yesButton); 
        yesButton.setAttribute('position', '.235 -.250 .1');
        // yesButton.setAttribute('basic-link', {href:  });

        let noButton = document.createElement("a-entity");
        noButton.setAttribute('gltf-model', '#rectangle1');
        noButton.addEventListener('model-loaded', () => {
          const obj3 = noButton.getObject3D('mesh');
          var texture3 = new THREE.TextureLoader().load('https://servicemedia.s3.amazonaws.com/assets/pics/no_button1.png');
          texture3.encoding = THREE.sRGBEncoding; 
          texture3.flipY = false; 
          var material = new THREE.MeshBasicMaterial( { map: texture3, transparent: true } ); 
          obj3.traverse(node => {
              node.material = material;
              // console.log("tryna setup CLOSE BUTTON MATERIAL");
            });
          noButton.addEventListener('mouseover', function () {

            // if (triggerAudioController != null) {
            //   triggerAudioController.components.trigger_audio_control.playAudio();
            // }
          });
          noButton.addEventListener('mousedown', function () {
            ShowHideDialogPanel();
          });
        });
        noButton.setAttribute("scale", '.075 .075 .075');
        this.el.appendChild(noButton); 
        noButton.setAttribute('position', '-.235 -.250 .1');
        noButton.classList.add("activeObjexRay");  
        this.onClick = this.onClick.bind(this);
    },
    play: function () {
      window.addEventListener('click', this.onClick);
    },
    pause: function () {
      window.removeEventListener('click', this.onClick);
    },
    onClick: function (evt) {
      // console.log("tryna set focus ");
      // this.el.focus();
    },
    updatePosition: function () {

      var cameraEl = document.getElementById('viewportPlaceholder'); //much easier!
      // var posRotReader = document.getElementById("player").components.get_pos_rot; 
      // var posRotObj = posRotReader.returnPosRot();
      // let cameraPosition = posRotObj.pos;
      // let cameraRotation = posRotObj.rot;
      // var cameraPosition = cameraEl.getAttribute('position');
      var cameraPosition = new THREE.Vector3(); 

      cameraEl.object3D.getWorldPosition( cameraPosition );
      console.log("cameraPositrion " + JSON.stringify(cameraPosition));
      // let newPos = {};
      // newPos.x = cameraPosition.x;
      // newPos.y = cameraPosition.y + .08;
      // newPos.z = cameraPosition.z - 1.15;

      this.el.setAttribute('position', cameraPosition);
    }
  });

  AFRAME.registerComponent('use-textitem-modals', {
    
    init: function(){
      
    }
  });

  AFRAME.registerComponent('mailbox', {
    init: function() {

    }
  });

} //sceneEl != null close
// }); //onload close

var HideMobileKeyboard = function() {
	document.activeElement.blur();
	$("input").blur();
};

//  var modalCloser = document.getElementById("modalCloser"); //or the close button
//  if (modalCloser != null) {
//    modalCloser.addEventListener('click', function() {
//       theModal.style.display = "none";
//       HideMobileKeyboard();
//    });
// }
function TabMangler(evt, tagName) {
  console.log("tryna switch to " + tagName);
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  let tagnameEl = document.getElementById(tagName);
  let mtitleEl = document.getElementById('modalTitle');
  if (tagnameEl != null) {
      tagnameEl.style.display = "block";
  }
  // document.getElementById(tagName).style.display = "block";
  if (evt != null) {
      evt.currentTarget.className += " active";
  }
  if (mtitleEl != null) {
      if (tagName != "Welcome") {
          mtitleEl.innerHTML = "<h3>" + tagName + "</h3>";
      } else {
          
          mtitleEl.innerHTML = "<h3>" + tagName + " " + avatarName + "!</h3>";
      }
  }
  
}

function SceneManglerModal(mode) {
  // HideAll();
  let userName = userData.userName;
  let greeting = document.getElementById('sceneGreeting').innerHTML;
  let quest = document.getElementById('sceneQuest').innerHTML;
  let ownerButton = "";
  if (userData.sceneOwner == "indaehoose") {
      ownerButton = "<button class=\x22deleteButton\x22 id=\x22editButton\x22><a href=\x22../main/?type=scene&iid="+userData.sceneID+"\x22>Edit Scene</a></button>";
  }
  let tabs ="<div class=\x22tab\x22>" +
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Welcome')\x22>Welcome</button>"+
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Quests')\x22>Quests</button>"+
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Messages')\x22>Messages</button>"+
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Locations')\x22>Locations</button>"+
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Tools')\x22>Tools</button>"+
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'Media')\x22>Media</button>"+
  "<button class=\x22tablinks\x22 onclick=\x22TabMangler(event, 'About')\x22>About</button>"+

  "</div>";
  let welcomeDisplay = "";
  let questsDisplay = "";
  let messagesDisplay = "";
  let locationsDisplay = "";
  let toolsDisplay = "";
  let mediaDisplay = "";
  if (mode == "Welcome") {
      welcomeDisplay = "style=\x22display: block;\x22";
  }
  if (mode == "Quests") {
      questsDisplay = "style=\x22display: block;\x22";
  }
  if (mode == "Messages") {
      messagesDisplay = "style=\x22display: block;\x22";
  }    
  if (mode == "Locations") {
      locationsDisplay = "style=\x22display: block;\x22";
  }    
  if (mode == "Tools") {
      toolsDisplay = "style=\x22display: block;\x22";
  }
  if (mode == "Media") {
      mediaDisplay = "style=\x22display: block;\x22";
  }
  let users = document.getElementById('users').htmlContent;
  let content = "<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span>"+
              "<div><span id=\x22modalTitle\x22><h3>Scene Mangler</h3></span>" + //populate modal
  tabs+

  "<div "+welcomeDisplay+" id=\x22Welcome\x22 class=\x22tabcontent\x22>"+
      "<div><p>" + greeting + "</p></div>"+
  "</div>"+    
  "<div "+questsDisplay+" id=\x22Quests\x22 class=\x22tabcontent\x22>"+
      // "<form id=\x22form\x22 id=\x22chat_form\x22>"+
      "<div><p>" + quest + "</p></div>"+
  "</div>"+
  "<div "+messagesDisplay+" id=\x22Messages\x22 class=\x22tabcontent\x22>"+
             // "<form id=\x22form\x22 id=\x22chat_form\x22>"+
      // "<span style=\x22float: left;\x22><h4>Message:</h4></span><span style=\x22float: left;\x22 id=\x22users\x22>"+stringRoomUsers+"</span>"+
      "<br><span style=\x22float: left;\x22 id=\x22users\x22>"+stringRoomUsers+"</span>"+
      "<button class=\x22saveButton\x22 id=\x22sendMessageButton\x22 onclick=\x22SendMessage()\x22>Send</button><br>"+
                      "<textarea class=\x22chat_input\x22 id=\x22chat_input\x22 type=\x22textarea\x22 style=\x22font-size:10pt;rows:4;cols:200;\x22 placeholder=\x22New message...\x22></textarea><br><br>"+
                     
                      // "</form>"+
                      "<div class=\x22\x22 id=\x22future\x22></div><br><br>" +
  "</div>"+
 
  "<div "+locationsDisplay+" id=\x22Locations\x22 class=\x22tabcontent\x22>"+

  "<button class=\x22deleteButton\x22 id=\x22ClearAllPlaceholdersButton\x22 onclick=\x22ClearPlaceholders()\x22>Clear Locations</button>"+
      "<button class=\x22saveButton\x22 id=\x22CreatePlaceholderButton\x22 onclick=\x22CreatePlaceholder()\x22>New Location</button>"+
      "<br><br><br><div>"+ReturnLocationTable()+"</div><br>"+
  "</div>"+     

  "<div "+toolsDisplay+" id=\x22Tools\x22 class=\x22tabcontent\x22>"+
  "<button class=\x22saveButton\x22 id=\x22exportButton\x22 onclick=\x22exportMods()\x22>Export Mods</button>"+
  "<button class=\x22infoButton\x22 id=\x22importButton\x22 onclick=\x22importMods()\x22>Import Mods</button>"+
  ownerButton +
  "</div>"+
  "<div "+mediaDisplay+"id=\x22Media\x22 class=\x22tabcontent\x22>"+
      "<h3>Media</h3>"+
      "<p>Tweak it up</p>"+
  "</div>"+
  "<div id=\x22About\x22 class=\x22tabcontent\x22>"+
      "<h3>About this thing</h3>"+
      "<p>ServiceMedia is a network of immersive scenes, and the cloud platform that supports them, built and maintained by <a href=\x22mailto:jim@servicemedia.net\x22>Jim Cherry</a></p>"+
  "</div>"+
   
   "</div>";
   showDialogPanel = false; //cause it's flipped
   ShowHideDialogPanel(content);
   TabMangler(null, mode);
  //  document.getElementById(mode).style.display = "block";
  //  document.getElementById('modalTitle').innerHTML = "<h3>Scene " + mode + "</h3>";
}
function PlayButton() {

}

function ShowHideDialogPanel (htmlString) {
  //   console.log("tryna ShowHideDialogPanel " + window.sceneType + " htmlString: " + htmlString);
    
    if (window.sceneType == undefined) {
      window.sceneType = "modelviewer";
    
    }
    
    if (window.sceneType != null) {
    
    
      console.log("showhide " + window.sceneType + " " + showDialogPanel + " " + dialogInitialized);
      if (theModal == null) {
        theModal = document.getElementById('theModal');
      } 
      // if (theRenderCanvas == null) {
        theRenderCanvas = document.getElementById('renderCanvas');  //with render-canvas aframe component attached, see above
      // }
      showDialogPanel = !showDialogPanel;
      if (showDialogPanel) { 
        if (!dialogInitialized) {
          var modalCloser = document.getElementById("modalCloser"); //or the close button
          if (modalCloser != null) {
            modalCloser.addEventListener('click', function() {
               theModal.style.display = "none";
               HideMobileKeyboard();
              });
          }
          dialogInitialized = true;
          if (theRenderCanvas != null) {
            theRenderCanvas.setAttribute('visible', true);
  
            theRenderCanvas.components.render_canvas.updatePosition();
          } else {
            console.log ("no renderPanel!");
          }
          console.log("wtf is the window.sceneType???? " + window.sceneType);
          if (htmlString != null && htmlString != 'default') {
              let content = document.getElementById(elementID);
              $(content).append(htmlString);
          } else if (window.sceneType.includes('Text Adventure')) {
            console.log("ok, tryna TTL..");
            // StartTeletypeMessage();
            GetTextItems();
            
            } else {
            let content = document.getElementById(elementID);
              let userName = document.getElementById('userName').innerHTML;
              let greeting = document.getElementById('sceneGreeting').innerHTML;
              console.log("GREETING: " + greeting);
              $(content).html("<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div><h3>" +userName + "!</h3><hr><p>" + greeting + "</p></div>");
  
              // console.log("userName: " + userName);
              // const iframe = document.createElement( 'iframe' );
              // iframe.style.width = '480px';
              // iframe.style.height = '360px';
              // iframe.style.border = '0px';
              // iframe.src = 'https://www.youtube.com/embed/VGUUfKoGQc4';
              // let iframe = "<iframe width=\x22560\x22 height=\x22315\x22 src=\x22https://www.youtube.com/embed/VGUUfKoGQc4\x22 title=\x22YouTube video player\x22 frameborder=\x220\x22 allow=\x22accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\x22 allowfullscreen></iframe>";
              // div.appendChild( iframe );
              // let greetingString = 
              
            } 
  
          } else {
              if (htmlString != null && htmlString != 'default') {
                  let content = document.getElementById(elementID);
                  $(content).html(htmlString);
              } else {
                  let content = document.getElementById(elementID);
                    let userName = document.getElementById('userName').innerHTML;
                    let greeting = document.getElementById('sceneGreeting').innerHTML;
                    console.log("GREETING: " + greeting);
                    $(content).html("<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span>"+
                    "<div><h3>" +userName + "!</h3><hr><p>" + greeting + "</p></div>");
              }
          }
              // !dialogInitialized end
          // if (document.getElementById('renderCanvas') != null) {
          if (theRenderCanvas != null) {  
  
            theRenderCanvas.components.render_canvas.updatePosition();
          theRenderCanvas.setAttribute('visible', true);
          //  theRenderCanvas.setAttribute('position', worldPos.x, worldPos.y - 5, worldPos.z);
          } else {
            theModal.style.display = "block";
            theModal.style.zIndex = 100;
          } 
        } else {
          console.log("tryna hide render panel");
          // ShowAll(); //everything hidden when modal is shown
          if (document.getElementById('renderCanvas') != null) {
          theRenderCanvas.setAttribute('visible', false);
  
            //theRenderCanvas.style.display = "none";
          } else {
            theModal.style.display = "none";
            theModal.style.zIndex = -100;
          }
        }
      }
    }
// function ShowHideDialogPanel () {
//   console.log("tryna ShowHideDialogPanel " + window.sceneType);
  
//   if (window.sceneType == undefined) {
//     window.sceneType = "modelviewer";
  
//   }
  
//   if (window.sceneType != null) {
  
  
//     console.log("showhide " + window.sceneType + " " + showDialogPanel + " " + dialogInitialized);
//     if (theModal == null) {
//       theModal = document.getElementById('theModal');
//     } 
//     // if (theRenderCanvas == null) {
//       theRenderCanvas = document.getElementById('renderCanvas');  //with render-canvas aframe component attached, see above
//     // }
//     showDialogPanel = !showDialogPanel;
//     if (showDialogPanel) { 
//       if (!dialogInitialized) {
//         var modalCloser = document.getElementById("modalCloser"); //or the close button
//         if (modalCloser != null) {
//           modalCloser.addEventListener('click', function() {
//              theModal.style.display = "none";
//              HideMobileKeyboard();
//             });
//         }
//         dialogInitialized = true;
//         if (theRenderCanvas != null) {
//           theRenderCanvas.setAttribute('visible', true);

//           theRenderCanvas.components.render_canvas.updatePosition();
//         } else {
//           console.log ("no renderPanel!");
//         }
//         console.log("wtf is the window.sceneType???? " + window.sceneType);
//         if (window.sceneType.includes('Text Adventure')) {
//           console.log("ok, tryna TTL..");
//           // StartTeletypeMessage();
//           GetTextItems();
          
//           } else {
//           let content = document.getElementById(elementID);
//             let userName = userData.userName;
//             let greeting = document.getElementById('sceneGreeting').innerHTML;
//             console.log("GREETING: " + greeting);
//             $(content).append("<span id='modalCloser' onclick=\x22ShowHideDialogPanel()\x22 class='close-modal'>&times;</span><div>" +userName + "!<p>" + greeting + "</p></div>");

//             // console.log("userName: " + userName);
//             // const iframe = document.createElement( 'iframe' );
//             // iframe.style.width = '480px';
//             // iframe.style.height = '360px';
//             // iframe.style.border = '0px';
//             // iframe.src = 'https://www.youtube.com/embed/VGUUfKoGQc4';
//             // let iframe = "<iframe width=\x22560\x22 height=\x22315\x22 src=\x22https://www.youtube.com/embed/VGUUfKoGQc4\x22 title=\x22YouTube video player\x22 frameborder=\x220\x22 allow=\x22accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\x22 allowfullscreen></iframe>";
//             // div.appendChild( iframe );
//             // let greetingString = 
            
//           } 

//         } // !dialogInitialized end
//         // if (document.getElementById('renderCanvas') != null) {
//         if (theRenderCanvas != null) {  

//           theRenderCanvas.components.render_canvas.updatePosition();
//         theRenderCanvas.setAttribute('visible', true);
//         //  theRenderCanvas.setAttribute('position', worldPos.x, worldPos.y - 5, worldPos.z);
//         } else {
//           theModal.style.display = "block";
//           theModal.style.zIndex = 100;
//         } 
//       } else {
//         console.log("tryna hide render panel");
//         if (document.getElementById('renderCanvas') != null) {
//         theRenderCanvas.setAttribute('visible', false);
//           //theRenderCanvas.style.display = "none";
//         } else {
//           theModal.style.display = "none";
//           theModal.style.zIndex = -100;
//         }
//       }
//     }
//   }
// //forked from https://github.com/keyvank/teletype.js
function teletype(element, callback) {

      var enabled = false;
      this.disable = function() {
        enabled = false;
      }
      this.enable = function() {
        enabled = true;
      }
    
      var fake_textarea = document.createElement("textarea");
      fake_textarea.style.position = 'absolute';
      fake_textarea.style.left = '-999999px';
      fake_textarea.opacity = '0';
      fake_textarea.setAttribute('autocorrect','off');
      fake_textarea.setAttribute('autocapitalize','off');
      element.appendChild(fake_textarea);
    
      element.addEventListener('focus', function() { fake_textarea.focus(); });
    
      element.setAttribute('tabindex', '0');
      element.style.lineHeight = element.style.fontSize;
      element.style.wordBreak = 'break-all';
      element.style.overflowWrap = 'break';
      element.style.boxSizing = 'border-box';
      element.style.paddingBottom = element.style.fontSize;
    
      var that = this;
      var input = '';
    
      var queue = [];
      var printing = false;
    
      this.printHTML = function(html, options = {}, _go = false, _node = null, _printed = '') {
        if (!_go && _printed == '') {
          if (printing) {
            queue.push([html, options]);
            return;
          } else if (options.wait) {
            printing = true;
            setTimeout(that.printHTML, options.wait, html, options, true, _printed);
            return;
          }
        }
        if (options.delay && html.length > 0) {
          printing = true;
          var i = 0;
          var prnt = '';
          if (!_node) {
            _node = document.createElement("span");
            element.appendChild(_node);
          }
          if (html[0] == '<') {
            prnt += '<';
            while (i < html.length && html[i] != '>') {
              i++;
              prnt += html[i];
            }
            _printed += prnt;
            _node.innerHTML = _printed;
          } else if (html[0] == '&') {
            prnt += '&';
            while (i < html.length && html[i] != ';') {
              i++;
              prnt += html[i];
            }
            _printed += prnt;
            _node.innerHTML = _printed;

          } else {
            _printed += html[i];
            _node.innerHTML = _printed;
          }
          teletype.scrollBottom(element);
          setTimeout(that.printHTML, options.delay, html.substr(i + 1), options, true, _node, _printed);
          // playSound();//THIS ONE
        } else {
          if(!_node)
            element.insertAdjacentHTML('beforeend', html);
          printing = false;
          if (options.enable) {
            enabled = true;
          }
          if (queue.length > 0) {
            var job = queue.shift();
            setTimeout(that.printHTML, job[1].wait, job[0], job[1], true);
          }
        }
      }
    
      this.printText = function(text, style, options = {}) {
        var html = teletype.encodeHTML(text);
        
        if (style)
          that.printHTML("<span style='" + style + "'>" + html + "</span>", options);
        else
          that.printHTML(html, options);
      }
    
      this.clear = function() {
        input = '';
        element.innerHTML = '';
        element.appendChild(fake_textarea);
        fake_textarea.focus();
        teletype.scrollBottom(element);
      }
      var prompt_node = null;
      function onchar(char) {
        if (!enabled)
          return false;
        //playSound();
        if (char == 13 || char == 10) { // Enter
          command_cache.push(input);
          command_cache_position = command_cache.length;
          element.insertAdjacentHTML('beforeend', '<br>');
          callback(teletype.decodeHTML(input));
          input = '';
          prompt_node = null;
          teletype.scrollBottom(element);
          return false;
        } else if (char == 8) { // Backspace
          if (input.length > 0) {
            var decode = teletype.decodeHTML(input);
            input = teletype.encodeHTML(decode.slice(0, -1));
            prompt_node.innerHTML = input.toUpperCase();
            return false;
          }
        } else {
          if(!prompt_node) {
            prompt_node = document.createElement('span');
            element.appendChild(prompt_node);
          }
          var html = teletype.encodeHTML(String.fromCharCode(char));
          input += html;
          prompt_node.innerHTML = input.toUpperCase();
          teletype.scrollBottom(element);
          return false;
        }
      }
    
      var fake_textarea_length = 0;
      fake_textarea.addEventListener('input', function(e) {
        var new_length = e.target.value.length;
        if(new_length == fake_textarea_length - 1)
          onchar(8);
        else if(new_length == fake_textarea_length + 1)
          onchar(e.target.value.charCodeAt(new_length - 1));
        fake_textarea_length = e.target.value.length;
      });
    
      var command_cache = [];
      var command_cache_position = null;
      fake_textarea.addEventListener('keydown', function(e) {
        if (!enabled)
          return false;
        if (e.keyCode == 38 || e.keyCode == 40) { // Arrow keys
          var changed = false;
          if (e.keyCode == 38 && command_cache_position > 0) {
            changed = true;
            command_cache_position--;
          } else if (e.keyCode == 40 && command_cache_position < command_cache.length - 1) {
            changed = true;
            command_cache_position++;
          }
          if (changed) {
            if(!prompt_node) {
              prompt_node = document.createElement('span');
              element.appendChild(prompt_node);
            }
            input = command_cache[command_cache_position]
            prompt_node.innerHTML = input;
          }
          return false;
        }
        return true;
      });
    }
    
    teletype.scrollBottom = function(element) {
      element.scrollTop = element.scrollHeight;
    }
    teletype.encodeHTML = function(text) {
      var div = document.createElement("div");
      div.innerText = text;
      return div.innerHTML;
    }
    teletype.decodeHTML = function(html) {
      var div = document.createElement("div");
      div.innerHTML = html;
      return div.innerText;
    }

function playSound(){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = 'http://mvmv.us.s3.amazonaws.com/sites/chickenwaffle/gunterquiz/btn_click.mp3';
    audio.autoplay = true;
    audio.volume = .1;
    audio.onended = function(){
        audio.remove() //Remove when played.
    };
    document.body.appendChild(audio);
}

// 
var GetTextItems = function() {
  let textIDs = document.getElementById("sceneTextItems").getAttribute("data-attribute");
  console.log("TEXtITEMS AHOY!" + textIDs + " length " + textIDs.length);
  let tempArray = []; 
  if (!textIDs.indexOf(",") == -1) { //make sure to send request with an array
    tempArray[0] = textIDs;
  } else {
    tempArray = textIDs.split(",");
  }
  var posting = $.ajax({
    url: "/scene_text_items",
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
            // uname: uName,
            // upass: uPass
            // param2: $('#textbox2').val()
            textIDs: tempArray //just send the ids
          }),
        success: function( data, textStatus, xhr ){
            // console.log(JSON.parse(data[i].textstring));
            let arr = [];
            for (let i = 0; i < data.length; i++) {
              console.log(JSON.parse(data[i].textstring));
              arr.push(JSON.parse(data[i].textstring)); //textstring should be a valid json, from defined template
            }
            // return arr;
            // textItemArray = arr;
            // PlayDialogLoop(arr);
            // var r = data.replace(/["']/g, ""); //cleanup
            // var resp = r.split('~'); //response is tilde delimited
            // Cookies.set('_id', resp[0], { expires: 7 });
            // $('#response pre').html( "logged in as " + resp[1] );
            // cookie = Cookies.get();
            // location.href = "./index.html";
            console.log(JSON.stringify(arr));
            StartTeletypeMessage(arr);
        },
        error: function( xhr, textStatus, errorThrown ){
            console.log( xhr.responseText );
            return null;
            // $('#theForm').html( 'Sorry, something went wrong: \n' + xhr.responseText);
            // Cookies.remove('_id');
            }
        });
}

var StartTeletypeMessage = function (theArray) {
    // textItems = document.getElementById("text_items");
    // if (text_items)
   //by the time we're done below, textItemArray will be popped
    // let theArray = GetTextItems();

    // if (theArray != undefined && theArray.length > 0) {
    console.log("tryna StartTeletypeMessage " + theArray);
    if (elementID == 'modalContent') {      
      theModal = document.getElementById('theModal');
      theModal.style.display = "block";
    }
    // theModal.style.display = "block";
    var element = document.getElementById(elementID);
    // renderPanel = document.getElementById('renderPanel');
    // var element = document.createElement("div"); 
    // element.classList.add('message-box');
    // theModal.style.display = "block";
    // element.id = 'modal-content';
    var tty = new teletype(element, function(str) {
      console.log(str);
        if (str.length > 0) {
        tty.disable();
        if (str.toUpperCase().includes("Y") || str.toUpperCase().includes("OK") || str.toUpperCase().includes("SURE")) {
            // GetDialogs()
            if (theArray != null) {
               PlayDialogLoop(theArray); 
            } else {
              tty.printText("ERROR GETTING DIALOGZ!?!",'color:white', {delay:50, wait:1000});
            }
           
        } else {
            // GetScores();
            tty.printText("OK MAYBE LATER THANKS BYE!",'color:white', {delay:50, wait:1000});
        }
      }
    });
    tty.disable();
    

    // tty.printText("Hi!\n",'', {delay:50, wait:1000});
    // tty.printText("\nWould you like to play a game?\n",'', {delay:50, wait:1000});
    tty.printText("\n\nWOULD YOU LIKE TO PLAY A GAME?",'color:white', {delay:50, wait:1000});
    tty.printText("\n", 'color:blue', {wait:1000,delay:50,enable:true});
    // renderPanel.innerHTML = "\n\nWOULD YOU LIKE TO PLAY A GAME?";
    element.focus(); //TODO test for desktop
  
  
    // } else {
  //   var tty = new teletype(element, function(str) {
  //     console.log(str);
  //     // tty.disable();
  //     tty.printText("ERROR GETTING DIALOGZ!?!",'', {delay:50, wait:1000});
  //   });
  // }
  // });

    // tty.printText("\n", '', {wait:1000,delay:50,enable:true});
  // }
}
var FinalMessage = function() {
    var element = document.getElementById(elementID); 
    var tty = new teletype(element, function(str) {
        console.log(str);
        tty.disable();
        if (str.includes("@") && str.includes(".")) { //needs to be an email, or close...
            //PostScore(scoreTotal, str);//
            tty.printText("\n\n" + "NOW YOUR EMAIL ARE BELONG TO US!",'color:white', {delay:50, wait:1000});
        } else {
            FinalFinalMessage();
        }
    });
    tty.disable();
  
    tty.printText("\n\n" + "GREAT JOB PLAYER! YOUR TOTAL SCORE IS " + scoreTotal + ".\n  ENTER YOUR EMAIL TO SAVE SCORE",'color:white', {delay:50, wait:1000});
    tty.printText("\n", '', {wait:1000,delay:50,enable:true});
    element.focus(); // TODO test for desktop
} 
var FinalFinalMessage = function() {
    var element = document.getElementById(elementID); 
    var tty = new teletype(element, function(str) {
        console.log(str);
        tty.disable();
        if (str.includes("@") && str.includes(".")) {
          tty.printText("\n\n" + "NOW YOUR EMAIL ARE BELONG TO US!",'color:red', {delay:50, wait:1000});
        } else {
            FinalFinalMessage();
        }
    });
    tty.disable();
   
    tty.printText("\nYOU MUST ENTER YOUR EMAIL ADDRESS TO SAVE SCORE",'color:white', {delay:50, wait:1000});

    tty.printText("\n", '', {wait:1000,delay:50,enable:true});
    element.focus();
}

// document.body.addEventListener('click', GetDialogs, true); 
var scoreTotal = 0;
var x = 0;
var HideKeyboard = function() {
	document.activeElement.blur();
	$("input").blur();
};
var PlayDialogLoop = function(arr) {
    ShowDialog(arr[x],function(){
        x++;
        if(x < arr.length) {
            PlayDialogLoop(arr);   
        } else {
            setTimeout(FinalMessage, 2000);
        }
    }); 
  }

  function ShowDialog(dialog, callback) {
        console.log(dialog);
        var element = document.getElementById(elementID);
        
        var tty = new teletype(element, function(inputString) {

          console.log(inputString);
          tty.disable();
          HideKeyboard(); 
          var score = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
          let isCorrect = false;
          let answerValue = 0;
          let responseValue = 0;
          for (let i = 0; i < dialog.answers_correct.length; i++) {
            if (inputString.toUpperCase() == dialog.answers_correct[i].item.toUpperCase()) {//TODO maybe includes, or regex?(:())
              // tty.printText("\n" + dialog.response_correct[i].toUpperCase() + "! + " + score + " POINTS", 'color:white', {wait:1000,delay:50});
              // scoreTotal += score;
              // setTimeout(callback, 1000 + (dialog.response_correct.length * 10));
              isCorrect = true;
              answerValue = dialog.answers_correct[i].value; 
              // value = i;
            } 
          }
          if (isCorrect) {
            // let isMatch = false;
            for (let a = 0; a < dialog.responses_correct.length; a++)  {
              if (answerValue == dialog.responses_correct[a].value) {
                tty.printText("\n" + dialog.responses_correct[a].item.toUpperCase() + "! + " + score + " POINTS", 'color:lightblue', {wait:1000,delay:50});
                scoreTotal += score;
                setTimeout(callback, 1000 + (dialog.responses_correct[a].item.length * 10));
              } else {
                // tty.printText("\n! nilch", 'color:white', {wait:1000,delay:50});
              }
            }
          } else {
            let isMatch = false;
            for (let j = 0; j < dialog.answers_incorrect.length; j++) {
              if (inputString.toUpperCase() == dialog.answers_incorrect[j].item.toUpperCase()) {
                isMatch = true
                responseValue = dialog.answers_incorrect[j].value; 
              } 
            }
            if (isMatch) {
              console.log("checking incorrect response value " + responseValue);
              for (let n = 0; n < dialog.responses_incorrect.length; n++)  {
                if (responseValue == dialog.responses_incorrect[n].value) {
                  tty.printText("\n" + dialog.responses_incorrect[n].item.toUpperCase() + "! - " + score + " POINTS", 'color:pink', {wait:1000,delay:50});
                  scoreTotal -= score;
                  setTimeout(callback, 1000 + (dialog.responses_incorrect[n].item.length * 10));
                } else {
                  // tty.printText("\nNOT TRUE!", 'color:white', {wait:1000,delay:50});
                  // setTimeout(callback, 1000 + (10 * 10));
                }
              }
            } else {
              tty.printText("\nINCORRECT", 'color:pink', {wait:1000,delay:50});
              setTimeout(callback, 1000 + (10 * 10));
            }
            // tty.printText("\n" + dialog.responses_correct[value].item.toUpperCase() + "! + " + score + " POINTS", 'color:white', {wait:1000,delay:50});
            // scoreTotal += score;
            // setTimeout(callback, 1000 + (dialog.responses_correct[value].item.length * 10));
            // // iResponses = dialog.responses_incorrect.split("~");
            // var response = iResponses[Math.floor(Math.random()*iResponses.length)];
            // tty.printText("\n" + response.toUpperCase() + " - " + score + " POINTS", 'color:red', {wait:1000,delay:50});
            // scoreTotal -= score;
            // setTimeout(callback, 1000 + (response.length * 10));
          }
          
        });
        tty.disable();

        tty.printText("\n\n" + dialog.question.toUpperCase(),'color:white', {delay:50, wait:2000});
        tty.printText("\n", 'color:red', {wait:100,delay:50,enable:true}); //enable:true = user input
        element.focus(); //TODO test for desktop
        // }
    }
    async function processArray(array) {
    for (const item of array) {
        await delayedLog(item);
    }
    console.log('Done!');
    }
