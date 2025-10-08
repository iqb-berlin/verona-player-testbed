import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  HomeComponent, ResponsesComponent, SettingsComponent, UnitHostComponent
} from './components';
import { UnitActivateGuard } from './services/unit-route-guards';

const routes: Routes = [
  {
    path: 'u/:u',
    component: UnitHostComponent,
    canActivate: [UnitActivateGuard]
  },
  {
    path: '',
    redirectTo: 'h',
    pathMatch: 'full'
  },
  {
    path: 'h',
    component: HomeComponent
  },
  {
    path: 's',
    component: SettingsComponent
  },
  {
    path: 'r',
    component: ResponsesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
