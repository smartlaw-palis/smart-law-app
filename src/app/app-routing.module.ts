import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityComponent } from './entity/entity.component';
import { TrustComponent } from './trust/trust.component';
import { TrustDetailComponent } from './trust-detail/trust-detail.component';
import { TrusteeComponent } from './trustee/trustee.component';
import { IreoComponent } from './ireo/ireo.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TrusteeComponent
  },
  {
    path: 'legal-entities',
    component: EntityComponent
  },
  {
    path: 'ireos',
    component: IreoComponent
  },
  // {
  //   path: 'smart-trust/:hash',
  //   component: TrustDetailComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
