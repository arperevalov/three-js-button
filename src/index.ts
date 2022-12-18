import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from'three/examples/jsm/loaders/RGBELoader';
import { Light } from 'three';

let sizes = {
    innerHeight,
    innerWidth
}

const light = new THREE.SpotLight('#84FEC4', 2, 100);
light.position.set(0, 10, 0)
const light2 = new THREE.PointLight('purple', 1, 100, );
light2.position.set(0, 0, 20)

const camera = new THREE.PerspectiveCamera(45, sizes.innerWidth / sizes.innerHeight)
camera.position.z = 10
camera.position.y = 7

const meshes:any[] = [];
const lights:Light[] = [light, light2];
const groups:any[] = [];

const scene = new THREE.Scene();
scene.environment = null
scene.background = new THREE.Color('#ccc')
// scene.add(...meshes)
// scene.add(...lights)

const envLoader = new RGBELoader(); 
envLoader.load('./public/hdri/pizzo_pernice_puresky_1k.hdr', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr
})

const loader = new GLTFLoader();
loader.load('./public/models/button_hirez.glb', (object)=> {
    scene.add(object.scene)
    meshes.push(object.scene.children[0])
    meshes.push(object.scene.children[1])

    groups.push(object.scene)

    meshes[0].material = new THREE.MeshStandardMaterial({
        roughness: .7,
        metalness: 0,
        color: "#fff"})
    meshes[1].material = new THREE.MeshStandardMaterial({
        roughness: .7,
        metalness: 0,
        color: "#fff"})
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.innerWidth, sizes.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .5
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement)
renderer.render( scene, camera );

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

const keydown = () => {
    meshes[1].position.y = -.2
}

const keyup = () => {
    meshes[1].position.y = 0
}
document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)

document.addEventListener('touchstart', keydown)
document.addEventListener('touchend', keyup)



window.addEventListener('resize', ()=> {
    sizes = {innerHeight, innerWidth}
    camera.aspect = sizes.innerWidth/sizes.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.innerWidth, sizes.innerHeight)
})

const loop = () => {
    controls.update()
    requestAnimationFrame(loop)
    renderer.render(scene, camera)
}

loop()