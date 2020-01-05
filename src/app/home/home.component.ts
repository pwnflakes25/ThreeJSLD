import { Component, OnInit, AfterViewInit} from '@angular/core';
import {ThreejsService} from '../threejs.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
imgURL = "https://cdn.pixabay.com/photo/2016/09/09/07/47/cube-1656301_960_720.png"
scURL: string;
  constructor(private ts: ThreejsService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.scURL = this.ts.getImageURL();
  }

}
