//from https://jsfiddle.net/prisoner849/mcdtatpv/show/
var vertShader = `
    uniform float size;
    uniform float time;
    uniform float amplitude;
    uniform float waveLength;
    varying float ampNormalized;
  	void main() {
      vec3 p = position;
      float wLength = 1. / waveLength;
      p.y = sin(position.x * wLength + time) * cos(position.z * wLength  + time) * amplitude;
      ampNormalized = abs(- amplitude  + p.y) / (amplitude * 2.);
    	vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
      gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );
      gl_Position = projectionMatrix * mvPosition;
		}
  `;
  var fragShader = `
  	uniform vec3 color;
    uniform float opacity;
    varying float ampNormalized;
    void main() {
      vec3 c = color;
      c.g = ampNormalized * ampNormalized * ampNormalized;
      gl_FragColor = vec4(c, opacity);
    }
  `;
  var weedVertShader = `
    #define PI 3.1415926
    uniform float time;
    uniform float amplitude;
    uniform float waveLength;
    uniform vec3 pos;
    uniform float timeSpeed;
    uniform float weedHeight;
    uniform float initRotation;
    uniform float speedRotation;
    varying vec3 varPos;
  	void main() {
    
      vec3 p = position + pos + vec3(0., .1, 0.);
      float wLength = 1. / waveLength;
      float heightNormal = position.y / weedHeight;
      float oneRound = heightNormal * PI * 2.;
      //rotation
      p.y += sin(p.x * wLength + time) * cos(p.z * wLength  + time) * amplitude;
      p.x = cos(-time * speedRotation + oneRound + initRotation) * position.x;
      p.z = sin(-time * speedRotation + oneRound + initRotation) * position.x;
      
      //swirl
      p.x += cos(-time * speedRotation + oneRound) * heightNormal * 10.;
      p.z += sin(-time * speedRotation + oneRound) * heightNormal * 10.;
      
      p += pos + vec3(0., .1, 0.);
      
      varPos = position;
      
      vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
		}
  `;
  var weedFragShader = `
  	uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    varying vec3 varPos;
    void main() {
      vec3 c = mix(color1, color2, sin(varPos.y - time * 10.) * cos(abs(varPos.x) - time * 5.) * .5 + .5) ;
      gl_FragColor = vec4(c, 1.0);
    }
  `;
  var mantaVertShader = `
    uniform float size;
    uniform float time;
    uniform float halfWidth;
    varying vec3 varPos;
    
    // alteredq's code of cubes
    //===============================================
    vec3 rotateVectorByQuaternion( vec3 v, vec4 q ) {

				vec3 dest = vec3( 0.0 );

				float x = v.x, y  = v.y, z  = v.z;
				float qx = q.x, qy = q.y, qz = q.z, qw = q.w;

				// calculate quaternion * vector

				float ix =  qw * x + qy * z - qz * y,
					  iy =  qw * y + qz * x - qx * z,
					  iz =  qw * z + qx * y - qy * x,
					  iw = -qx * x - qy * y - qz * z;

				// calculate result * inverse quaternion

				dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
				dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
				dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

				return dest;

			}
      
			vec4 axisAngleToQuaternion( vec3 axis, float angle ) {

				vec4 dest = vec4( 0.0 );

				float halfAngle = angle / 2.0,
					  s = sin( halfAngle );

				dest.x = axis.x * s;
				dest.y = axis.y * s;
				dest.z = axis.z * s;
				dest.w = cos( halfAngle );

				return dest;

			}
    //===============================================
    
  	void main() {
      vec3 p = position;
      float r = position.x;
      float flapRatio = abs(position.x) / halfWidth;
      float w = cos(time * 1.5) * radians(15.) * flapRatio * flapRatio * flapRatio;
      p.x = cos(w) * r;
      p.y += sin(w) * r * sign(r);
      p.x += 100.;
      p.y += sin(time * 0.2) * 10.;
      
      vec4 qRotation = axisAngleToQuaternion( vec3(0., 1., 0. ), -time * .2);
      vec3 newPosition = rotateVectorByQuaternion( p, qRotation );
      
      varPos = position;
      
    	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
      gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );
      gl_Position = projectionMatrix * mvPosition;
		}
  `;
  var mantaFragShader = `
  	uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    varying vec3 varPos;
    void main() {
      vec3 c = mix(color1, color2, sin(varPos.z * .1 + time * 2.) * cos(abs(varPos.x * .2) - time ) * .5 + .5) ;
      gl_FragColor = vec4(c, 1.0);
    }
  `;
