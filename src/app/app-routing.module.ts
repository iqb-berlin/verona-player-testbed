import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitHostComponent } from './unit-host/unit-host.component';
import { AppRootComponent } from './app-root/app-root.component';
import { UnitActivateGuard } from './unit-host/unit-route-guards';

const routes: Routes = [
  {
    path: 'u/:u',
    component: UnitHostComponent,
    canActivate: [UnitActivateGuard]
  },
  {
    path: '',
    redirectTo: 'r',
    pathMatch: 'full'
  },
  {
    path: 'r',
    component: AppRootComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
