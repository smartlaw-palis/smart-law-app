import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Web3Service } from '../web3.service';
import _ from 'lodash';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  isOwner: boolean = false;
  isNewOwner: boolean = false;

  newEntityModal: any = null;
  entity: any = {
    category: 0,
    accreditedInvestor: false,
    country: ''
  };
  entities: any = null;
  newEntityBtn: any = {
    caption: 'Create',
    isProcessing: false
  };

  constructor(
    private _web3: Web3Service,
    private _modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.getEntities();
    this._web3.isContractOwner()
      .then((res: any) => {
        this.isOwner = res;
      })
    this._web3.isContractNewOwner()
      .then((res: any) => {
        this.isNewOwner = res;
      })
  }

  getEntities() {
    this._web3.getEntities()
      .then((res: any) => {
        this.entities = res;
      })
  }

  open(content) {
    this.newBtnStatus(false);
    this._web3.isEntityOwner()
      .then(res => {
        if (!res)
          this.newEntityModal = this._modalService.open(content);
        else
          this._web3.showError('Already an entity.');
      })
  }

  private newBtnStatus(status) {
    if (status) {
      this.newEntityBtn.caption = "Processing...";
      this.newEntityBtn.isProcessing = true;
    } else {
      this.newEntityBtn.caption = "Create";
      this.newEntityBtn.isProcessing = false;
    }
  }

  // verifyEntity(address, i) {
  //   //this.entities[i].hasPendingVerification = true;
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return this._web3.smartLawInstance.methods.verifyEntity(address)
  //         .send({ from: account })
  //     })
  //     .then(receipt => {
  //       this.getEntities();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       //this.entities[i].hasPendingVerification = false;
  //       this._web3.showError(err);
  //     })
  // }

  // acceptOwnership() {
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return this._web3.smartLawInstance.methods.acceptOwnership()
  //         .send({ from: account })
  //     })
  //     .then(receipt => {
  //       this.getEntities();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this._web3.showError(err);
  //     })
  // }
  //
  createNewEntity() {
    this.newBtnStatus(true);
    this._web3.activeAccount()
      .then(account => {
        return this._web3.EntityFactoryInstance.methods.newEntity(this.entity.category, this.entity.accreditedInvestor, this.entity.country)
          .send({ from: account })
      })
      .then(receipt => {
        this.getEntities();
        this.newBtnStatus(false);
        this.newEntityModal.close();
        this._web3.showSuccess(receipt.transactionHash);
      })
      .catch(err => {
        this.newBtnStatus(false);
        this.newEntityModal.close();
        this._web3.showError(err);
      })
  }

}
