import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitHostComponent } from './unit-host/unit-host.component';
import { SettingsComponent } from './settings/settings.component';
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
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
