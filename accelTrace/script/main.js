var camera, scene, renderer;
var geometry, material, mesh,  light;
var index = 0;
var speed;
function init(){
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();											// redenrer type
	renderer.setPixelRatio( window.devicePixelRatio );								// ?
	renderer.setClearColor( 0xaaaaaa, 1);											// background color
	renderer.setSize( window.innerWidth, window.innerHeight );						// size
	document.body.appendChild( renderer.domElement );								// add canvas to document

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 100;
	// camera.position.y = 70;

	material = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading });
	geometry = new THREE.BoxGeometry( 1, 1, 1);
	mesh = new THREE.Mesh( geometry, material );

	var segments = 200;
	var positions = new Float32Array( segments * 3 );
	var colors = new Float32Array( segments * 3 );
	var r = 10;

	scene.add( mesh );

	speed = new THREE.Vector3( 1, 0, 0 );
	window.addEventListener("devicemotion", accelUpdate);
}
function animate() {
	requestAnimationFrame( animate );

	// mesh.rotation.x += 0.005;

	renderer.render( scene, camera );
}
function accelUpdate(e){
	speed.add(e.acceleration);
	mesh.position.add(speed.divideScalar(4));
}
init();
animate();