import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as THREE from 'three';
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



  //<=== function below just animate the canvas ===>
  animate() {
  const geometry = this.objectToDisplay;
	requestAnimationFrame(this.animate.bind(this));
  this.rotate(geometry);
	this.renderer.render( this.scene, this.camera );
 }

//<=== function below rotates object ===>
 rotate(object) {
   object.rotation.x += 0.01;
   object.rotation.y += 0.01;
 }



}
