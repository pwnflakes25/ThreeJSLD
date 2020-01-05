import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { HomeComponent } from './home/home.component';
import {ScenePageComponent} from './scene-page/scene-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: 'item/:geometry',
    component: ItemComponent
  },
  {
    path: 'complex/:room',
    component: ScenePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
