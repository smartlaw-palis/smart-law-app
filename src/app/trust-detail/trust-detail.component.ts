import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Params
} from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Web3Service } from '../web3.service';
import _ from 'lodash';

@Component({
  selector: 'app-trust-detail',
  templateUrl: './trust-detail.component.html',
  styleUrls: ['./trust-detail.component.scss']
})
export class TrustDetailComponent implements OnInit {

  pendingBeneficiaries: any = null;
  newTrustBeneficiary: string = null;
  trust: any = null;
  beneficiaries: any = null;
  dissolveSignatures: any = null;
  saleOffers: any = null;
  saleOfferDetails: any = null;
  trustHash: string = null;
  isBeneficiary: boolean = null;

  newBeneficiaryBtn: any = {
    caption: 'Add',
    isProcessing: false
  };
  offerSaleBtn: any = {
    caption: 'Submit',
    isProcessing: false
  };
  dissolveBtn: any = {
    caption: 'Yes',
    isProcessing: false
  };
  cancelBtn: any = {
    caption: 'Yes',
    isProcessing: false
  };

  entities: any = null;
  newBeneficiaryModal: any = null;
  cancelModal: any = null;
  dissolveModal: any = null;
  saleOfferModal: any = null;
  saleOffersModal: any = null;
  pendingBeneficiariesModal: any = null;
  amount: number = null;

  constructor(
    private _web3: Web3Service,
    private _modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) { }

  // private newBeneficiaryBtnStatus(status) {
  //   if (status) {
  //     this.newBeneficiaryBtn.caption = "Processing...";
  //     this.newBeneficiaryBtn.isProcessing = true;
  //   } else {
  //     this.newBeneficiaryBtn.caption = "Add";
  //     this.newBeneficiaryBtn.isProcessing = false;
  //   }
  // }
  //
  // private dissolveBtnStatus(status) {
  //   if (status) {
  //     this.dissolveBtn.caption = "Processing...";
  //     this.dissolveBtn.isProcessing = true;
  //   } else {
  //     this.dissolveBtn.caption = "Yes";
  //     this.dissolveBtn.isProcessing = false;
  //   }
  // }
  //
  // private cancelBtnStatus(status) {
  //   if (status) {
  //     this.cancelBtn.caption = "Processing...";
  //     this.cancelBtn.isProcessing = true;
  //   } else {
  //     this.cancelBtn.caption = "Yes";
  //     this.cancelBtn.isProcessing = false;
  //   }
  // }
  //
  // private offerSaleBtnStatus(status) {
  //   if (status) {
  //     this.offerSaleBtn.caption = "Processing...";
  //     this.offerSaleBtn.isProcessing = true;
  //   } else {
  //     this.offerSaleBtn.caption = "Submit";
  //     this.offerSaleBtn.isProcessing = false;
  //   }
  // }
  //
  // buyTrust() {
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return this._web3.smartLawInstance.methods.buyTrust(this.trustHash)
  //         .send({ from: account, value: this._web3.web3.utils.toWei(this.trust.amount) })
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this._web3.showError(err);
  //     })
  // }
  //
  // getEntities() {
  //   this.entities = null;
  //   this._web3.entityAddresses()
  //     .then((res: any) => {
  //       this.entities = res;
  //     })
  // }
  //
  // showNewBeneficiaryModal(content) {
  //   this.getEntities();
  //   this.newBeneficiaryBtnStatus(false);
  //   this.newBeneficiaryModal = this._modalService.open(content);
  // }
  //
  // showPendingBeneficiariesModal(content) {
  //   this.pendingBeneficiariesModal = this._modalService.open(content, { size: 'lg' });
  //   this.pendingBeneficiaries = null;
  //   this._web3.getTrustPendingBeneficiaries(this.trustHash)
  //     .then((res: any) => {
  //       this.pendingBeneficiaries = res;
  //     })
  // }
  //
  // showSaleOfferModal(content) {
  //   this.offerSaleBtnStatus(false);
  //   this.saleOfferModal = this._modalService.open(content);
  // }
  //
  // showDissolveModal(content) {
  //   this.dissolveBtnStatus(false);
  //   this.dissolveModal = this._modalService.open(content);
  // }
  //
  // showCancelModal(content) {
  //   this.cancelBtnStatus(false);
  //   this.cancelModal = this._modalService.open(content);
  // }
  //
  // showSaleOffersModal(content) {
  //   this.saleOffersModal = this._modalService.open(content, { size: 'lg' });
  //   this.saleOfferDetails = null;
  //   this._web3.getTrustSaleOffers(this.trustHash)
  //     .then((res: any) => {
  //       this.saleOfferDetails = res;
  //     })
  // }
  //
  // agreeToOffer(sale_hash) {
  //   let trustInstance = this._web3.createTrustInstance(this.trustHash);
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return trustInstance.methods.agreeToSaleOffer(sale_hash)
  //         .send({ from: account });
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this.saleOffersModal.close();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this.saleOffersModal.close();
  //       this._web3.showError(err);
  //     })
  // }
  //
  // agreeToAddBeneficiary(beneficiary_hash) {
  //   let trustInstance = this._web3.createTrustInstance(this.trustHash);
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return trustInstance.methods.agreeToAddBeneficiary(beneficiary_hash)
  //         .send({ from: account })
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this.pendingBeneficiariesModal.close();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this.pendingBeneficiariesModal.close();
  //       this._web3.showError("Error getting default account.");
  //     })
  // }
  //
  // submitSaleOffer() {
  //   let trustInstance = this._web3.createTrustInstance(this.trustHash);
  //   this.offerSaleBtnStatus(true);
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return trustInstance.methods.newSaleOffer(this._web3.web3.utils.toWei(this.amount + '', 'ether'))
  //         .send({ from: account })
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this.offerSaleBtnStatus(false);
  //       this.saleOfferModal.close();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this.offerSaleBtnStatus(false);
  //       this.saleOfferModal.close();
  //       this._web3.showError(err);
  //     })
  // }
  //
  // submitCancel() {
  //   let trustInstance = this._web3.createTrustInstance(this.trustHash);
  //   this.cancelBtnStatus(true);
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return trustInstance.methods.cancelSale()
  //         .send({ from: account })
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this.cancelBtnStatus(false);
  //       this.cancelModal.close();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this.cancelBtnStatus(false);
  //       this.cancelModal.close();
  //       this._web3.showError(err);
  //     })
  // }
  //
  // submitDissolve() {
  //   let trustInstance = this._web3.createTrustInstance(this.trustHash);
  //   this.dissolveBtnStatus(true);
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return trustInstance.methods.dissolve()
  //         .send({ from: account });
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this.dissolveBtnStatus(false);
  //       this.dissolveModal.close();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this.dissolveBtnStatus(false);
  //       this.dissolveModal.close();
  //       this._web3.showError(err);
  //     })
  // }
  //
  // addNewBeneficiary() {
  //   let trustInstance = this._web3.createTrustInstance(this.trustHash);
  //   this.newBeneficiaryBtnStatus(true);
  //   this._web3.activeAccount()
  //     .then(account => {
  //       return trustInstance.methods.newBeneficiary(this.newTrustBeneficiary)
  //         .send({ from: account })
  //     })
  //     .then(receipt => {
  //       this.trustDetails();
  //       this.newBeneficiaryBtnStatus(false);
  //       this.newBeneficiaryModal.close();
  //       this._web3.showSuccess(receipt.transactionHash);
  //     })
  //     .catch(err => {
  //       this.newBeneficiaryBtnStatus(false);
  //       this.newBeneficiaryModal.close();
  //       this._web3.showError(err);
  //     })
  // }
  //
  // trustDetails() {
  //   this._web3.getTrustDetails(this.trustHash)
  //     .then((res: any) => {
  //       this.trust = res;
  //     })
  // }
  //
  ngOnInit() {
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   this.trustHash = params['hash'];
    //   this.trustDetails();
    //   this._web3.isTrustBeneficiary(this.trustHash)
    //     .then((res: any) => {
    //       this.isBeneficiary = res;
    //     });
    // });
  }

}
