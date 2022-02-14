varying float noise;
uniform float time;

float turbulence( vec3 p ) {

  float w = 100.0;
  float t = -.5;

  for (float f = 1.0 ; f <= 10.0 ; f++ ){
    float power = pow( 2.0, f );
    t += abs( pnoise3( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }

  return t;

}

void main() {
  noise = 10.0 *  -.10 * turbulence( .5 * normal + time / 3.0 );
  float b = 5.0 * pnoise3( 0.05 * position, vec3( 100.0 ) );
  float displacement = (- 10. * noise + b) / 50.0;

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}