// import AFRAME from '/main/ref/aframe/dist/aframe-master.min_20210716.js';

import DragControls from '/three/examples/jsm/controls/DragControls.js';

let name = 'drag-controls';

AFRAME.registerComponent(name, {
	schema: {
		enabled: {default: true},
		objects: {default: '*'},
	},
	init() {
		let {el} = this;
		let {
			camera,
			renderer,
		} = el.sceneEl;
		let controls = new DragControls(
			[],
			camera,
			renderer.domElement,
		);
		controls.addEventListener('dragstart', () => {
			el.emit(`${name}:changed`, {active: true}, false);
		});
		controls.addEventListener('dragend', () => {
			el.emit(`${name}:changed`, {active: false}, false);
		});
		let mapObjectToEl = new Map();
		[
			'dragstart',
			'drag',
			'dragend',
			'hoveron',
			'hoveroff',
		].forEach(type => {
			controls.addEventListener(type, ({object}) => {
				let el = mapObjectToEl.get(object);
				if (el) {
					el.emit(type, {object3D: object}, false);
				}
			});
		});
		Object.assign(this, {
			camera,
			controls,
			mapObjectToEl,
		});
	},
	update() {
		let {
			controls,
			data,
		} = this;
		let {enabled} = data;
		Object.assign(controls, {enabled});
	},
	remove() {
		this.controls.dispose();
	},
	tock() {
		let {
			controls,
			data,
			el,
			mapObjectToEl,
		} = this;
		let {
			enabled,
			objects: selector,
		} = data;
		if (enabled) {
			let els = Array.from(el.sceneEl.querySelectorAll(selector));
			let objects = [];
			mapObjectToEl.clear();
			els.forEach(el => {
				if (el.isEntity && el.object3D) {
					Object.keys(el.object3DMap).forEach(key => {
						let object = el.getObject3D(key);
						objects.push(object);
						mapObjectToEl.set(object, el);
					});
				}
			});
			controls.getObjects().splice(0, undefined, ...objects);
		}
	},
});


AFRAME.registerComponent('moveable-placeholder', {
	schema: {
	  eventData: {default: ''},
	},
	init: function () {
	  var sceneEl = document.querySelector('a-scene');
		//let calloutString = this.data.calloutString;
  
		let calloutEntity = document.createElement("a-entity");
		let calloutText = document.createElement("a-text");
		let thisEl = this.el;
		// this.calloutText = calloutText;
		// calloutText.setAttribute('overlay');
		calloutEntity.setAttribute("look-at", "#player");
		calloutEntity.setAttribute('visible', false);
		// calloutEntity.setAttribute("render-order", "hud");
		sceneEl.appendChild(calloutEntity);
		calloutEntity.appendChild(calloutText);
		calloutText.setAttribute("position", '0 0 .3'); //offset the child on z toward camera, to prevent overlap on model
		calloutText.setAttribute('text', {
		  baseline: "bottom",
		  align: "center",
		  font: "/fonts/Exo2Bold.fnt",
		  anchor: "center",
		  wrapCount: 150,
		  color: "white",
		  value: ""
		});
	  this.el.addEventListener('model-loaded', (event) => {
		console.log("moveable-placeholder modelloaded");
		const obj = this.el.getObject3D('mesh');
		this.xhandle = null;
		this.yhanlde = null;
		this.zhandle = null;
  
		  // if (obj) {
		  
		obj.traverse(node => { //spin through object heirarchy to sniff for special names, e.g. "eye"
		  this.nodeName = node.name;
		  console.log(this.nodeName);
		  if (this.nodeName.includes("x_handle")) { 
			console.log("xhandle found");
			this.xhandle = node;
			// this.xhandle.
		  }
		  if (this.nodeName.includes("y_handle")) { 
			console.log("xhandle found");
			this.yhandle = node;
		  }
		  if (this.nodeName.includes("z_handle")) { 
			console.log("xhandle found");
			this.zhandle = node;
		  }
		});
	  });
  
	  this.el.addEventListener('mouseenter', function (evt) {
		console.log("tryna mouseover placeholder");
		calloutEntity.setAttribute('visible', true);
		let pos = evt.detail.intersection.point; //hitpoint on model
		console.log(evt.detail.intersection.object.name);
		// console.log(pos);
		calloutEntity.setAttribute("position", thisEl.getAttribute('position'));
		calloutText.setAttribute("value", "x : " + pos.x.toFixed(2) + "\n" +"y : " + pos.y.toFixed(2) + "\n" +"z : " + pos.x.toFixed(2));
		// calloutText.updateMatrixWorld();
  
	  });
	  this.el.addEventListener('mouseleave', function (evt) {
		// console.log("tryna mouseexit");
		calloutEntity.setAttribute('visible', false);
	  });
	},
	tick: function() {
  
	}
  
  });