

AFRAME.registerComponent('grid_effects', { 
    schema: {

  
    },
    init: function () {
        console.log("tryuna sety GRID EEFFFFEX!");
        var pWidth = 100;
        var pHeight = 100;
        // var planeGeom = new THREE.PlaneGeometry(500, 500, pWidth, pHeight).toGrid();
        var planeGeom = new THREE.PlaneGeometry(500, 500, pWidth, pHeight);
        planeGeom.rotateX(-Math.PI * .5);

        this.seaDown = new THREE.LineSegments(planeGeom, new THREE.ShaderMaterial({
        uniforms: {
            color: {
            value: new THREE.Color("blue")
            },
            opacity: {
            value: .75
            },
            time: {
            value: 0
            },
            amplitude: {
            value: 5
            },
            waveLength: {
            value: Math.PI * 10
            }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: true
        }));
        let floorLinesEl = document.createElement("a-entity");
        floorLinesEl.setObject3D('floorLines', this.seaDown);
        this.el.sceneEl.appendChild(floorLinesEl);
        // scene.add(seaDown);

        this.seaDownPoints = new THREE.Points(planeGeom, new THREE.ShaderMaterial({
        uniforms: {
            color: {
            value: new THREE.Color("maroon").multiplyScalar(1.25)
            },
            opacity: {
            value: 1
            },
            size: {
            value: 1.25
            },
            time: {
            value: .1
            },
            amplitude: {
            value: 5
            },
            waveLength: {
            value: Math.PI * 10
            }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: false
        }));
        let floorPointsEl = document.createElement("a-entity");
        floorPointsEl.setObject3D('floorPoints', this.seaDownPoints);
        this.el.sceneEl.appendChild(floorPointsEl);

        var depth = 50;
        this.seaSurface = new THREE.LineSegments(planeGeom, new THREE.ShaderMaterial({
        uniforms: {
            color: {
            value: new THREE.Color("red")
            },
            opacity: {
            value: .75
            },
            time: {
            value: .1
            },
            amplitude: {
            value: 5
            },
            waveLength: {
            value: Math.PI * 10
            }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: true
        }));
        this.seaSurface.position.y = depth;

        let ceilingLinesEl = document.createElement("a-entity");
        ceilingLinesEl.setObject3D('ceilingLines', this.seaSurface);
        this.el.sceneEl.appendChild(ceilingLinesEl);

        this.seaSurfacePoints = new THREE.Points(planeGeom, new THREE.ShaderMaterial({
        uniforms: {
            color: {
            value: new THREE.Color("gray").multiplyScalar(1.25)
            },
            opacity: {
            value: 1
            },
            size: {
            value: 1.25
            },
            time: {
            value: .1
            },
            amplitude: {
            value: 5
            },
            waveLength: {
            value: Math.PI * 10
            }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: false
        }));
        this.seaSurfacePoints.position.y = depth;

        let ceilingPointsEl = document.createElement("a-entity");
        ceilingPointsEl.setObject3D('ceilingLines', this.seaSurfacePoints);
        this.el.sceneEl.appendChild(ceilingPointsEl);

        // scene.add(seaSurfacePoints);

        // seaweed
       this.seaweeds = [];
        var weedHeight = 40;
        var seaweedGeom = new THREE.PlaneGeometry(4, weedHeight, 4, 40);
        seaweedGeom.translate(0, 20, 0);
        for (let i = 0; i < 20; i++) {
        let pos = new THREE.Vector3(THREE.MathUtils.randInt(-25, 25) * 5, 0, THREE.MathUtils.randInt(-25, 25) * 5);

        let seaweed = new THREE.LineSegments(seaweedGeom, new THREE.ShaderMaterial({
            uniforms: {
            color1: {
                value: new THREE.Color("teal")
            },
            color2: {
                value: new THREE.Color("aqua")
            },
            time: {
                value: .1
            },
            amplitude: {
                value: 5
            },
            waveLength: {
                value: Math.PI * 10
            },
            pos: {
                value: pos
            },
            timeSpeed: {
                value: THREE.MathUtils.randFloat(Math.PI * .5, Math.PI)
            },
            weedHeight: {
                value: weedHeight
            },
            initRotation: {
                value: THREE.MathUtils.randFloat(0, Math.PI)
            },
            speedRotation: {
                value: THREE.MathUtils.randFloat(Math.PI * 0.5, Math.PI)
            }
            },
            vertexShader: weedVertShader,
            fragmentShader: weedFragShader
        }));
        // scene.add(seaweed);
        let seaweedEl = document.createElement("a-entity");
        seaweedEl.setObject3D('seaweed', seaweed);
        this.el.sceneEl.appendChild(seaweedEl);
        this.seaweeds.push(seaweed)


        }

        // manta ray
        var mantaSize = 20;
        var mantaSegs = 20;
        var mantaGeom = new THREE.PlaneGeometry(mantaSize, mantaSize, mantaSegs, mantaSegs);
        mantaGeom.rotateX(-Math.PI * .5);
        mantaGeom.rotateY(-Math.PI * .25);
        var quartDiag = Math.sqrt(mantaSize * mantaSize + mantaSize * mantaSize) * .25;

        // head
        for (let i = 0; i < mantaGeom.attributes.position.count; i++) {
        let z = mantaGeom.attributes.position.array[i * 3 + 2];
        if (z > quartDiag * 1.5) {
            let shift = -(z - quartDiag * 1.5) / (quartDiag * .5) * 1.5;
            mantaGeom.attributes.position.array[i * 3 + 1] = shift;
            mantaGeom.attributes.position.array[i * 3 + 2] = quartDiag * 1.5 - shift;
        }
        }

        // wings
        for (let i = 0; i < mantaGeom.attributes.position.count; i++) {
        mantaGeom.attributes.position.array[i * 3] *= 1.5;
        }

        // tail
        mantaGeom.attributes.position.array[2] *= 1.5;

        var manta = new THREE.LineSegments(mantaGeom, new THREE.ShaderMaterial({
        uniforms: {
            color1: {
            value: new THREE.Color("gray")
            },
            color2: {
            value: new THREE.Color("white")
            },
            time: {
            value: 0
            },
            halfWidth: {
            value: quartDiag * 2 * 1.5
            }
        },
        vertexShader: mantaVertShader,
        fragmentShader: mantaFragShader
        }));
        manta.position.set(0, 20, 0);
        // scene.add(manta);

        var mantaPoints = new THREE.Points(mantaGeom, new THREE.ShaderMaterial({
        uniforms: {
            color1: {
            value: new THREE.Color("gray")
            },
            color2: {
            value: new THREE.Color("white")
            },
            time: {
            value: 0
            },
            size: {
            value: 1
            },
            halfWidth: {
            value: quartDiag * 2 * 1.5
            }
        },
        vertexShader: mantaVertShader,
        fragmentShader: mantaFragShader
        }))
        mantaPoints.position.copy(manta.position);
        // scene.add(mantaPoints);
},

tick: function (time, timeDelta) {
    // var clock = new THREE.Clock();
    var t = 0;
    // var delta = 0;
    // delta = timeDelta;
    // t += delta;
    t = timeDelta;

    console.log("t is " + t);
    // this.seaDown.material.uniforms.time.value = t * .001;
    // this.seaDownPoints.material.uniforms.time.value = t * .001;
    // this.seaSurface.material.uniforms.time.value = t * .0075;
    // this.seaSurfacePoints.material.uniforms.time.value = t * .0075;
    this.seaweeds.forEach(sw => {
        sw.material.uniforms.time.value = t * .001;
    });
    // manta.material.uniforms.time.value = t;
    // mantaPoints.material.uniforms.time.value = t;

    // scene.rotation.y += delta * 0.05;

    // renderer.render(scene, camera);

    }
});