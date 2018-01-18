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
  funds: any = 0;

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
      this._web3.availableFunds()
        .then((res: any) => {
          this.funds = Number(res).toFixed(6);
        })
  }

  withdraw() {
    let entityInstance = null;
    this._web3.accountEntityAddress()
      .then(entity => {
        entityInstance = this._web3.createEntityInstance(entity);
        return this._web3.activeAccount();
      })
      .then(account => {
        return entityInstance.methods.withdraw()
          .send({ from: account })
      })
      .then(receipt => {
        this._web3.showSuccess(receipt.transactionHash);
      })
      .catch(err => {
        this._web3.showError(err);
      })
  }
}
