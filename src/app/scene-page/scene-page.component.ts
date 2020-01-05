import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import{ThreejsService} from "../threejs.service";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-scene-page',
  templateUrl: './scene-page.component.html',
  styleUrls: ['./scene-page.component.css']
})
export class ScenePageComponent implements OnInit, AfterViewInit {
@ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
room;
roomObject;

  constructor(private ts: ThreejsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
       this.room = params.get("room")
    })
  }

  ngAfterViewInit() {
    this.ts.setUpTHREE(this.canvas.nativeElement);
    this.ts.addLight();
    this.ts.addAmbientLight();
    this.ts.addControl(this.canvas.nativeElement);
    this.ts.responsiveCanvas(this.canvas.nativeElement);
    this.renderRoom();
    this.ts.animate(this.roomObject);
  }


  renderRoom() {
   let loader = new GLTFLoader();
   loader.load('/assets/room1.glb', (gltf) => {
     this.roomObject = gltf.scene;
     this.ts.getScene().add(this.roomObject);
   })
   this.ts.getCamera().position.set(0,20,20);
   this.ts.getCamera().lookAt(0,10,0);
  }


}
