import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitHostComponent } from './unit-host/unit-host.component';
import { HomeComponent } from './home/home.component';
import { UnitActivateGuard } from './unit-host/unit-route-guards';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
