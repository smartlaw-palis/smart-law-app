import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Web3Service } from '../web3.service';
import _ from 'lodash';

@Component({
  selector: 'app-trust',
  templateUrl: './trust.component.html',
  styleUrls: ['./trust.component.scss']
})
export class TrustComponent implements OnInit {

  newTrustModal: any = null;
  trust: any = {
    name: '',
    property: '',
    beneficiary: ''
  };
  trusts: any = null;
  newTrustBtn: any = {
    caption: 'Create',
    isProcessing: false
  };
  entities: any = null;

  constructor(
    private _zone: NgZone,
    private _web3: Web3Service,
    private _modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.getTrusts();
  }

  getEntities() {
    this._web3.getEntitiesAddress()
      .then((res: any) => {
        this.entities = res;
      })
  }

  private newBtnStatus(status) {
    if (status) {
      this.newTrustBtn.caption = "Processing...";
      this.newTrustBtn.isProcessing = true;
    } else {
      this.newTrustBtn.caption = "Create";
      this.newTrustBtn.isProcessing = false;
    }
  }

  open(content) {
    this.getEntities();
    this.newBtnStatus(false);
    this.newTrustModal = this._modalService.open(content);
  }

  getTrusts() {
    this._web3.getTrusts()
      .then((res: any) => {
        this.trusts = res;
      })
  }

  createNewTrust() {
    this.newBtnStatus(true);
    this._web3.activeAccount()
      .then(account => {
        this._web3.smartLawInstance.methods.newTrust(this.trust.name, this.trust.property, this.trust.beneficiary)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            this.newBtnStatus(false);
            this.getTrusts();
            this._web3.showSuccess(hash);
            this.newTrustModal.close();
          })
          .on('receipt', receipt => {
            this.getTrusts();
          })
          .on('error', err => {
            this._web3.showError("Error creating trust.");
            this.newTrustModal.close();
            this.newBtnStatus(false);
          });
      })
      .catch(err => {
        this.newBtnStatus(false);
        this.newTrustModal.close();
        this._web3.showError("Error getting default account.");
      })
  }

}
