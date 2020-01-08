import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router, NavigationStart, Event as NavigationEvent} from "@angular/router";
import{ThreejsService} from "../threejs.service";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {Subscription} from 'rxjs';
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-scene-page',
  templateUrl: './scene-page.component.html',
  styleUrls: ['./scene-page.component.css']
})
export class ScenePageComponent implements OnInit, AfterViewInit, OnDestroy {
@ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
roomObject;
roomIndex;
roomScene;
routerSub: Subscription;

  constructor(private ts: ThreejsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.routerSub = this.router.events
    .pipe(filter((event: NavigationEvent) => event instanceof NavigationStart))
    .subscribe((event) => {
      this.roomObject.dataURL = this.ts.canvasToImage(this.canvas.nativeElement);
    })

    this.route.paramMap.subscribe(params => {
       this.roomIndex = +params.get("room");
       this.roomObject = this.ts.getOneRoom(this.roomIndex);
     })
  }

  ngAfterViewInit() {
    this.ts.setUpTHREE(this.canvas.nativeElement);
    this.ts.addLight();
    this.ts.addAmbientLight();
    this.ts.addControl(this.canvas.nativeElement);
    this.ts.responsiveCanvas(this.canvas.nativeElement);
    this.renderRoom(this.roomObject.fileURL);
    this.ts.animate(this.roomScene);
  }


  renderRoom(fileURL) {
   let loader = new GLTFLoader();
   loader.load(fileURL, (gltf) => {
     this.roomScene = gltf.scene;
     this.ts.getScene().add(this.roomScene);
   })
   this.ts.getCamera().position.set(0,20,20);
   this.ts.getCamera().lookAt(0,10,0);
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }


}
