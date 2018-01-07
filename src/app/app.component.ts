import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  isOwner: boolean = false;

  constructor(
    private _web3: Web3Service,
  ) {
    this._web3.activeAccount();
  }

  ngOnInit() {
    this._web3.isContractOwner()
      .then((res: any) => {
        this.isOwner = res;
      })
  }
}
