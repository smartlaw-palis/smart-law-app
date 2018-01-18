import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityComponent } from './entity/entity.component';
import { TrustComponent } from './trust/trust.component';
import { TrustDetailComponent } from './trust-detail/trust-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TrustComponent
  },
  {
    path: 'legal-entities',
    component: EntityComponent
  },
  {
    path: 'smart-trust/:hash',
    component: TrustDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
