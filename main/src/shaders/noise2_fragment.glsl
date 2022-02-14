varying float noise;

void main() {

  vec3 color = vec3(1. - 2. * noise);
  gl_FragColor = vec4( color.rgb, 1.0 );

} 