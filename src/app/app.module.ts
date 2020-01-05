import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { ItemComponent } from './item/item.component';
import { HomeComponent } from './home/home.component';
import { ScenePageComponent } from './scene-page/scene-page.component';
import {ThreejsService} from './threejs.service';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    HomeComponent,
    ScenePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule
  ],
  providers: [ThreejsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
