import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js';

/* global AFRAME, THREE */

AFRAME.registerComponent('handheld_fatline', {
schema: {
init: {default: false},
tags: {default: ''},
originID: {default: ''},
showLine: {default: false},
lineWiggle: {default: true}
},
// after: ["tracked-controls-webxr"],
init: function () {
this.positionMe = new THREE.Vector3();
this.directionMe = new THREE.Vector3();

//       this.el.object3D.getWorldPosition(this.positionMe); 
//       this.el.object3D.getWorldDirection(this.directionMe).negate();

this.loaded = false;
this.verticleez = null;
this.tubeGeometry_o = null;
this.tubeGeometry = null;
this.splineMesh = null;
this.splineMesh_o = null;
console.log("tryna make a mod_line");
this.newPosition = null; 
this.tangent = null;
// this.radians = null; 
this.fraction = 0;
this.normal = new THREE.Vector3( 0, 1, 0 ); // up
this.axis = new THREE.Vector3( );
this.points = [];
this.positions = [];
this.colors = [];
this.speed = .01;
this.isReady = false;

for (var i = 0; i < 4; i += 1) {
this.points.push(new THREE.Vector3(0, 0, -1 * (i / 4))); //
}
console.log("this.points " + JSON.stringify(this.points));

// this.c_geometry = new THREE.BufferGeometry().setFromPoints( this.c_points );
this.spline = new THREE.CatmullRomCurve3( this.points );
    const divisions = Math.round( 64 * this.points.length );
    const point = new THREE.Vector3();
    const color = new THREE.Color();

    for ( let i = 0, l = divisions; i < l; i ++ ) {

        const t = i / l;

        this.spline.getPoint( t, point );

        this.positions.push( point.x, point.y, point.z );

        color.setHSL( t, 1.0, 0.5, THREE.SRGBColorSpace );
        this.colors.push( color.r, color.g, color.b );

    }
this.c_geometry = new LineGeometry();

    this.c_geometry.setPositions( this.positions );
    this.c_geometry.setColors( this.colors );

    var matLine = new LineMaterial( {

        color: 0xffffff,
        linewidth: .02, // in world units with size attenuation, pixels otherwise
        vertexColors: true,

        dashed: false,
        alphaToCoverage: false,

});
    this.curveLine = new Line2( this.c_geometry, matLine );
    this.curveLine.computeLineDistances();
    this.curveLine.scale.set( 1, 1, 1 );

    this.el.object3D.add( this.curveLine );

const cgeometry = new THREE.SphereGeometry( .05, 16, 8 );
const cmaterial = new THREE.MeshBasicMaterial( { color: 0x00ff2a, wireframe: false, transparent: true, opacity: .5 } );
this.objectToCurve = new THREE.Mesh( cgeometry, cmaterial );
this.lineEnd = new THREE.Vector3();
this.lineMiddle1 = new THREE.Vector3();
this.lineMiddle2 = new THREE.Vector3();

this.pointsCopy = [];
this.pointsCopy[0] = new THREE.Vector3();
this.pointsCopy[1] = new THREE.Vector3();
this.pointsCopy[2] = new THREE.Vector3();
this.pointsCopy[3] = new THREE.Vector3();

this.pointsTemp = [];
this.pointsTemp[0] = new THREE.Vector3();
this.pointsTemp[1] = new THREE.Vector3();
this.pointsTemp[2] = new THREE.Vector3();
this.pointsTemp[3] = new THREE.Vector3();

// this.el.object3D.add(this.curveLine);
this.el.object3D.add(this.objectToCurve);
this.triggerAudioController = document.getElementById("triggerAudio");
this.modValue = 0;
this.toggleShowLine(true);
this.isReady = true;




},
toggleShowLine(showLine) {
if (showLine == true ) {
this.data.showLine = true;
window.isFiring = true;
if (this.triggerAudioController) {
this.triggerAudioController.components.trigger_audio_control.loopToggle(true);
this.triggerAudioController.components.trigger_audio_control.modLoop("rate", this.modValue);
}
this.curveLine.visible = true;
this.objectToCurve.visible = true;
} else {
this.data.showLine = false;
window.isFiring = false;
if (this.triggerAudioController) {
this.triggerAudioController.components.trigger_audio_control.modLoop("rate", 0);
this.triggerAudioController.components.trigger_audio_control.loopToggle(false);
}
// this.curveLine.visible = false;
this.objectToCurve.visible = false;
}
},
// from https://github.com/Mamboleoo/InfiniteTubes/blob/master/js/demo6.js
updateLine: function() {
// console.log("tyrha updateCurve");
// this.splineVerts = this.splineMesh.geometry.attributes.position.array;
// this.splineVerts_o = this.splineMesh_o.geometry.attributes.position.array;
// this.vert = null;
// this.splineMesh.geometry.attributes.position.needsUpdate = true;
if (!this.isReady) {return;}



this.fraction += 0.1;
if ( this.fraction > 1) {

// if (this.data.showLine) {
this.fraction = 0;




}

this.spline.needsUpdate = true;
this.objectToCurve.position.copy( this.spline.getPoint( this.fraction ) );         
this.tangent = this.spline.getTangent( this.fraction );
this.axis.crossVectors( this.normal, this.tangent ).normalize( );  
this.objectToCurve.quaternion.setFromAxisAngle( this.axis, Math.PI / 2 );
// this.c_points = this.spline.getPoints( 50 );
// this.c_geometry.setFromPoints(this.c_points);
// this.c_geometry.attributes.position.needsUpdate = true;
// this.curveLine.computeLineDistances();
// // this.curveLine.scale.set( 1, 1, 1 );
// this.curveLine.geometry.attributes.position.needsUpdate = true;
// this.curveLine.needsUpdate = true;
},
remove: function () {
console.log("tryna remove handline..");
this.el.removeObject3D('mesh');
// this.el.removeObject3D('');
},
tick: function () {
if (this.el.parentElement.is("triggered")) {
// console.log("line triggered");
// this.tubeMaterial.map.offset.x += this.speed;
this.updateLine();

} else {

}
}
});




AFRAME.registerComponent('transport_fatline', {
schema: {
init: {default: false},
tags: {default: ''},
originID: {default: ''},
showLine: {default: false},
lineWiggle: {default: true}
},

init: function () {
// this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
this.interval = "";
this.intervalTime = 0;
this.fraction = 0;
this.transportIsPlaying = false;
this.startTime = 0;
const positions = [];
    const colors = [];


const cgeometry = new THREE.SphereGeometry( .25, 16, 8 );
const cmaterial = new THREE.MeshBasicMaterial( { color: 0x00ff2a, wireframe: false, transparent: true, opacity: .5 } );
this.objectToCurve = new THREE.Mesh( cgeometry, cmaterial );
this.el.object3D.add(this.objectToCurve);
    // const points = GeometryUtils.hilbert3D( new THREE.Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
let points = [];
let n = 100;
let maxRadius = 2;

for (let i = 0; i < n; i++) {

// Size of each slice is '360 / n' degrees or in radians '2 * Math.PI / n'...
let angle = i * ( 2 * Math.PI / n );

// Calculate 'x' distance as 'radius * cos ( angle )' and 'y' distance using 'sin'...
let x = ( maxRadius ) * Math.cos( angle );

let y = ( maxRadius ) * Math.sin( angle );

let point = new THREE.Vector3(x, 1, y);
points.push(point);


}

    this.spline = new THREE.CatmullRomCurve3( points );
    const divisions = Math.round( 16 * points.length );
    const point = new THREE.Vector3();
    const color = new THREE.Color();

    for ( let i = 0, l = divisions; i < l; i ++ ) {

        const t = i / l;

        this.spline.getPoint( t, point );

        positions.push( point.x, point.y, point.z );

        color.setHSL( t, 1.0, 0.5, THREE.SRGBColorSpace );
        colors.push( color.r, color.g, color.b );

    }
// console.log("LINE POSITIONS: "+ JSON.stringify(positions));


    // Line2 ( LineGeometry, LineMaterial )

    const geometry = new LineGeometry();

    geometry.setPositions( positions );
    geometry.setColors( colors );

    var matLine = new LineMaterial( {

        color: 0xffffff,
        linewidth: .03, // in world units with size attenuation, pixels otherwise
        vertexColors: true,

        dashed: false,
        alphaToCoverage: false,

    } );

    var line = new Line2( geometry, matLine );
    line.computeLineDistances();
    line.scale.set( 1, 1, 1 );

    this.el.object3D.add( line );
},
setTimeParameters: function (interval, intervalTime) {
this.interval = interval;
this.intervalTime = intervalTime;
this.fraction = 0;
this.transportIsPlaying = true;
},
setTransportStatus: function (isPlaying) {
if (isPlaying) {
this.transportIsPlaying = true;
} else {
this.transportIsPlaying = false;
}
},
updateLinePosition: function () {

// console.log(this.intervalTime + " fraction " + this.fraction);
this.objectToCurve.position.copy( this.spline.getPoint( this.fraction ) );         
// this.tangent = this.spline.getTangent( this.fraction );
// this.axis.crossVectors( this.normal, this.tangent ).normalize( );  
// this.objectToCurve.quaternion.setFromAxisAngle( this.axis, Math.PI / 2 );
},
tick: function (time, deltaTime) {
if (this.transportIsPlaying) {
if (this.startTime == 0) {
this.startTime = time;
}
// console.log(time - this.startTime);
if (this.fraction < 1) {
this.fraction = (time - this.startTime) / this.intervalTime;
  // this.fraction = this.intervalTime / deltaTime;
// this.fraction += .01;
this.updateLinePosition();

} else {
this.fraction = 0;
this.startTime = 0;
}
} else {
//
}
}


});