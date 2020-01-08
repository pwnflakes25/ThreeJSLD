import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, NavigationStart, NavigationEnd, Router, Event as NavigationEvent } from "@angular/router";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ThreejsService} from "../threejs.service";
import {ConceptModel} from '../shared/concept.model';
import {Subscription} from 'rxjs';
import { filter } from "rxjs/operators";


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', {static: false}) rendererContainer: ElementRef;
  @ViewChild('canvasContainer', {static: false}) canvasContainer: ElementRef<HTMLCanvasElement>;
  @ViewChild('itemPage', {static: false}) itemPage: ElementRef;

  geoList: ConceptModel[];
  renderer;
  paramStored;
  routeSub: Subscription;
  scene;
  camera;
  geometry;
  mainMesh;
  material;
  mainObject;
  objectToDisplay;
  controls;
  pageView;
  isMesh: boolean = false;
  constructor(private route: ActivatedRoute, private ts: ThreejsService, private router:Router) {}

   ngOnInit() {
     this.route.paramMap.subscribe(params => {
        this.paramStored = +params.get("geometry");
        if(this.paramStored || this.paramStored === 0) {
         this.mainMesh = this.ts.getOneMesh(this.paramStored);
         this.isMesh = true;
       } else {
         this.mainObject = params.get("geometry")
       }
     })

     this.routeSub = this.router.events
      .pipe(
        filter(
                (event: NavigationEvent) => event instanceof NavigationStart))
                   .subscribe((event) => {
                          this.mainMesh.dataURL = this.ts.canvasToImage(this.canvasContainer.nativeElement);
     })
   }

   ngAfterViewInit() {
       this.ts.setUpTHREE(this.canvasContainer.nativeElement); //set up THREE essential components (camera, light, renderer)
       this.ts.addLight(); // add spotlight
       this.ts.addControl(this.canvasContainer.nativeElement); //add camera control
       this.ts.responsiveCanvas(this.canvasContainer.nativeElement); //make canvas responsive on page resize
       if(this.isMesh) {
         this.setUpGLTFModel(this.mainMesh.fileURL);
       } else {
         this.setUpGeometry(this.mainObject); // add geometry to scene
       }
       this.ts.animate(this.objectToDisplay); // animate the whole thing
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
    this.ts.getScene().add(this.objectToDisplay);
  }

  setUpSphereGeometry() {
    this.material = new THREE.MeshLambertMaterial({color: 0x00ffff});
    this.geometry = new THREE.SphereGeometry(2,40,40);
    this.objectToDisplay = new THREE.Mesh(this.geometry, this.material);
    this.ts.getScene().add(this.objectToDisplay);
  }

  setUpTriangleGeometry() {}

  // setUpWell() {
  //   var loader = new GLTFLoader();
  //   loader.load('/assets/well3D.glb', (gltf) => {
  //     this.objectToDisplay = gltf.scene;
  //     this.ts.getScene().add(this.objectToDisplay);
  //   })
  //   // const box = new THREE.Box3().setFromObject(this.objectToDisplay);
  //   // const boxSize = box.getSize(new THREE.Vector3()).length();
  //   // const boxCenter = box.getCenter(new THREE.Vector3());
  //   // this.frameArea(boxSize * 0.5, boxSize, boxCenter);
  //   this.ts.getCamera().position.set(0,20,20);
  //   this.ts.getCamera().lookAt(0,10,0);
  // }

  setUpGLTFModel(fileURL: string) {
    let loader = new GLTFLoader();
    loader.load(fileURL, (gltf) => {
      this.objectToDisplay = gltf.scene;
      this.ts.getScene().add(this.objectToDisplay);
    })
  }

  // setUpAnvil() {
  //   let loader = new GLTFLoader();
  //   loader.load('/assets/anvil.glb', (gltf) => {
  //     //below is a for each loop for all the children of the scene
  //     gltf.scene.traverse((child) => {
  //     console.log(child);
  //         if ( child instanceof THREE.Mesh && child.name === "Plane002") {
  //           this.objectToDisplay = child;
  //         }
  //     })
  //     this.ts.getScene().add(this.objectToDisplay);
  //     this.objectToDisplay.position.set(1,0,3);
  //   })
  //   this.ts.getCamera().position.set(1,2,8)
  // }


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

//function below converts canvas into image

ngOnDestroy() {
  this.routeSub.unsubscribe();
}


}
