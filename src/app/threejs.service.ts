import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";



@Injectable({
  providedIn: 'root'
})
export class ThreejsService {
scene;
camera;
renderer;
control;
element;
imageURL;
canvasData;

  constructor() {}

 getScene() {
   return this.scene;
 }
 getCamera() {
   return this.camera;
 }

 getRenderer() {
   return this.renderer;
 }

 getControl() {
   return this.control;
 }

 setUpTHREE(canvas1) {
     this.renderer = new THREE.WebGLRenderer({canvas: canvas1, preserveDrawingBuffer: true});
     this.scene = new THREE.Scene();
     this.canvasData = canvas1;
     this.camera = new THREE.PerspectiveCamera(
       75, //field of view
       canvas1.width/canvas1.height, //dimension
       0.1, //far plane
       1000
      )
     this.renderer.setClearColor("#e5e5e5");
     this.renderer.setSize(canvas1.width, canvas1.height);
     this.camera.position.z = 5;
  }

  addLight() {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.position.set( 0, 20, 60);
    this.scene.add(spotLight);
  }

  addHemiLight() {
    var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00,
    0.6);
    hemiLight.position.set(0, 500, 0);
    this.scene.add(hemiLight);
  }


  addAmbientLight() {
    let ambiColor = "#808080";
    let ambientLight = new THREE.AmbientLight(ambiColor);
    this.scene.add(ambientLight);
  }

  addControl(canvas) {
      this.control = new OrbitControls(this.camera, canvas);
      this.control.minDistance = 1;
      this.control.maxDistance = 1000;
  }

  responsiveCanvas(canvas) {
    window.addEventListener('resize', () => {
    this.renderer.setSize(canvas.width, canvas.height);
    this.camera.aspect = canvas.width/ canvas.height;
    this.camera.updateProjectMatrix;
    })
  }

  animate(scene) {
  const scenery = scene;
  requestAnimationFrame(this.animate.bind(this));
  this.canvasToImage(this.canvasData)
  this.control.update();
  this.renderer.render( this.scene, this.camera );
 }

 // storeCanvasImage(imageURL) {
 //   this.imageURL = imageURL;
 // }

getImageURL() {
  return this.imageURL;
}

canvasToImage(canvas) {
  let dataURL = canvas.toDataURL("image/jpeg");
  this.imageURL = dataURL;
}



}
