import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastyModule } from 'ng2-toasty';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EntityComponent } from './entity/entity.component';
import { TrustComponent } from './trust/trust.component';
import { Web3Service } from './web3.service';
import { TrustDetailComponent } from './trust-detail/trust-detail.component';
import { TrusteeComponent } from './trustee/trustee.component';
import { IreoComponent } from './ireo/ireo.component';


@NgModule({
  declarations: [
    AppComponent,
    EntityComponent,
    TrustComponent,
    TrustDetailComponent,
    TrusteeComponent,
    IreoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ToastyModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
