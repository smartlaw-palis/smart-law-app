import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Web3Service } from '../web3.service';
import _ from 'lodash';

@Component({
  selector: 'app-trustee',
  templateUrl: './trustee.component.html',
  styleUrls: ['./trustee.component.scss']
})
export class TrusteeComponent implements OnInit {

    newTrusteeModal: any = null;
    trustee: any = {
      name: ''
    };
    trustees: any = null;
    newTrusteeBtn: any = {
      caption: 'Create',
      isProcessing: false
    };

    constructor(
      private _web3: Web3Service,
      private _modalService: NgbModal
    ) {
    }

  ngOnInit() {
      this.getTrustees();
  }

  getTrustees() {
    this._web3.getTrustees()
      .then((res: any) => {
        this.trustees = res;
      })
  }

  open(content) {
    this.newBtnStatus(false);
    this._web3.isTrusteeOwner()
      .then(res => {
        if (!res)
          this.newTrusteeModal = this._modalService.open(content);
        else
          this._web3.showError('Already a trustee.');
      })
  }

  private newBtnStatus(status) {
    if (status) {
      this.newTrusteeBtn.caption = "Processing...";
      this.newTrusteeBtn.isProcessing = true;
    } else {
      this.newTrusteeBtn.caption = "Create";
      this.newTrusteeBtn.isProcessing = false;
    }
  }

  createNewTrustee() {
    this.newBtnStatus(true);
    this._web3.activeAccount()
      .then(account => {
        return this._web3.TrusteeFactoryInstance.methods.newTrustee(this.trustee.name)
          .send({ from: account })
      })
      .then(receipt => {
        this.getTrustees();
        this.newBtnStatus(false);
        this.newTrusteeModal.close();
        this._web3.showSuccess(receipt.transactionHash);
      })
      .catch(err => {
        this.newBtnStatus(false);
        this.newTrusteeModal.close();
        this._web3.showError(err);
      })
  }

}
