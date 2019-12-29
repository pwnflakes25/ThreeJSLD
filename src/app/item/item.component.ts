import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {geometries} from "../shared/geometries";


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer', {static: false}) rendererContainer: ElementRef;
  @ViewChild('canvasContainer', {static: false}) canvasContainer: ElementRef<HTMLCanvasElement>;
  geoList: string[];
  renderer;
  scene;
  camera;
  geometry;
  material;
  mainObject;
  objectToDisplay;
  controls;

  constructor(private route: ActivatedRoute) {
    this.geoList = [...geometries];
   }

   ngOnInit() {
     this.route.paramMap.subscribe(params => {
        this.mainObject = params.get("geometry")
     })
   }

   ngAfterViewInit() {
       this.setUpTHREE();
       this.setUpLight();
       this.setUpGeometry(this.mainObject);

      //function below allow the canvas size to respond to changes in the window size
      window.addEventListener('resize', () => {
      this.renderer.setSize(this.canvasContainer.nativeElement.width, this.canvasContainer.nativeElement.height);
      this.camera.aspect = this.canvasContainer.nativeElement.width/this.canvasContainer.nativeElement.height;
      this.camera.updateProjectMatrix;
      })

       this.animate();
  }

  // <=====  this function is responsible in setting up the THREE's environment such as scene and camera ======>
  setUpTHREE() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasContainer.nativeElement});
    this.scene = new THREE.Scene();
    //below sets up the camera
    this.camera = new THREE.PerspectiveCamera(
      75, //field of view
      this.canvasContainer.nativeElement.width/this.canvasContainer.nativeElement.height, //dimension
      0.1, //far plane
      1000
     )
     //below change the color of background
     this.renderer.setClearColor("#e5e5e5");

     //set the renderer size
     this.renderer.setSize(this.canvasContainer.nativeElement.width, this.canvasContainer.nativeElement.height);

     //set the camera position in the z axis
     this.camera.position.z = 5;

     this.controls = new OrbitControls(this.camera, this.canvasContainer.nativeElement);
     this.controls.minDistance = 1;
     this.controls.maxDistance = 1000;
  }

 setUpGeometry(geometry: string) {
   switch(geometry) {
     case 'cube' : {
       this.setUpBoxGeometry();
       break;
     }
     case 'sphere' : {
       this.setUpSphereGeometry();
       break;
     }
     case 'triangle' : {
       this.setUpTriangleGeometry();
       break;
     }
     case 'well' : {
       this.setUpWell();
       break;
     }
     case 'anvil' : {
       this.setUpAnvil();
       break;
     }
     default : {
       this.setUpBoxGeometry();
     }
   }
 }

 // <====== Function Below adds light to the scene =====>
 setUpLight() {
   const spotLight = new THREE.SpotLight(0xffffff);
   spotLight.position.set( -100, 20, 60);
   this.scene.add(spotLight);
 }

 // <===== Function below adds fog to the scene====>
 setUpFog() {
   this.scene.fog = new THREE.Fog(0xFF0000, 0.015, 100);
 }

 setUpFogDenser() {
   this.scene.fog = new THREE.FogExp2(0xFF0000, 0.05);
 }

  // <===== below sets up all the geometry I learned ===>

  setUpBoxGeometry() {
    this.material = new THREE.MeshLambertMaterial({color: 0x00ffff});
    this.geometry = new THREE.BoxGeometry(2,2,2);
    this.objectToDisplay = new THREE.Mesh( this.geometry, this.material );
    this.scene.add(this.objectToDisplay);
  }

  setUpSphereGeometry() {
    this.material = new THREE.MeshLambertMaterial({color: 0x00ffff});
    this.geometry = new THREE.SphereGeometry(2,40,40);
    this.objectToDisplay = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.objectToDisplay);
  }

  setUpTriangleGeometry() {}


  setUpWell() {
    var loader = new GLTFLoader();
    loader.load('/assets/well3D.glb', (gltf) => {
      this.objectToDisplay = gltf.scene;
      this.scene.add( this.objectToDisplay );
    })
    // const box = new THREE.Box3().setFromObject(this.objectToDisplay);
    // const boxSize = box.getSize(new THREE.Vector3()).length();
    // const boxCenter = box.getCenter(new THREE.Vector3());
    // this.frameArea(boxSize * 0.5, boxSize, boxCenter);
    this.camera.position.set(0,20,20);
    this.camera.lookAt(0,10,0);
  }

  setUpAnvil() {
    let loader = new GLTFLoader();
    loader.load('/assets/anvil.glb', (gltf) => {
      //below is a for each loop for all the children of the scene
      gltf.scene.traverse((child) => {
      console.log(child);
          if ( child instanceof THREE.Mesh && child.name === "Plane002") {
            this.objectToDisplay = child;
          }
      })

      this.scene.add(this.objectToDisplay);
      this.objectToDisplay.position.set(1,0,3);
    })
    this.camera.position.set(1,2,8)
  }


  //<=== function below just animate the canvas ===>
  animate() {
  const geometry = this.objectToDisplay;
	requestAnimationFrame(this.animate.bind(this));
  this.rotate(geometry);
  this.controls.update();
	this.renderer.render( this.scene, this.camera );
 }

//<=== function below rotates object ===>
 rotate(object) {
   if(object) {
     object.rotation.y += 0.01;
   }
 }

 frameArea(sizeToFitOnScreen, boxSize, boxCenter) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.Math.degToRad(this.camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = (new THREE.Vector3())
      .subVectors(this.camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  this.camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  this.camera.near = boxSize / 100;
  this.camera.far = boxSize * 100;

  this.camera.updateProjectionMatrix()

  // point the camera to look at the center of the box
  this.camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}



}
