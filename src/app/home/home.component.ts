import { Component, OnInit, AfterViewInit} from '@angular/core';
import {ThreejsService} from '../threejs.service';
import {ConceptModel} from "../shared/concept.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
imgURL = "https://cdn.pixabay.com/photo/2016/09/09/07/47/cube-1656301_960_720.png"
scURL: string = null;
meshes: ConceptModel[];
rooms: ConceptModel[];

  constructor(private ts: ThreejsService) {}

  ngOnInit() {
    this.meshes = this.ts.getMeshes();
    this.rooms = this.ts.getRooms();
    this.scURL = this.ts.getImageURL();
  }

  ngAfterViewInit() {
  }
}
