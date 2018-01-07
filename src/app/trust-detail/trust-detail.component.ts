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

  entities: any = null;
  newBeneficiaryModal: any = null;
  saleOfferModal: any = null;
  saleOffersModal: any = null;
  amount: number = null;

  constructor(
    private _web3: Web3Service,
    private _modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) { }

  private newBeneficiaryBtnStatus(status) {
    if (status) {
      this.newBeneficiaryBtn.caption = "Processing...";
      this.newBeneficiaryBtn.isProcessing = true;
    } else {
      this.newBeneficiaryBtn.caption = "Add";
      this.newBeneficiaryBtn.isProcessing = false;
    }
  }

  private offerSaleBtnStatus(status) {
    if (status) {
      this.offerSaleBtn.caption = "Processing...";
      this.offerSaleBtn.isProcessing = true;
    } else {
      this.offerSaleBtn.caption = "Submit";
      this.offerSaleBtn.isProcessing = false;
    }
  }

  buyTrust() {
    this._web3.activeAccount()
      .then(account => {
        this._web3.smartLawInstance.methods.buyBeneficialInterest(this.trustHash)
          .send({ from: account, value: this._web3.web3.utils.toWei(this.trust.amount) })
          .on('transactionHash', (hash) => {
            this._web3.showSuccess(hash);
          })
          .on('receipt', receipt => {
            //this.getTrusts();
          })
          .on('error', err => {
            this._web3.showError("Error buying trust.");
          });
      })
      .catch(err => {
        this._web3.showError("Error getting default account.");
      })
  }

  getEntities() {
    this.entities = null;
    this._web3.getEntitiesAddress()
      .then((res: any) => {
        this.entities = res;
      })
  }

  showNewBeneficiaryModal(content) {
    this.getEntities();
    this.newBeneficiaryBtnStatus(false);
    this.newBeneficiaryModal = this._modalService.open(content);
  }

  showSaleOfferModal(content) {
    this.offerSaleBtnStatus(false);
    this.saleOfferModal = this._modalService.open(content);
  }

  showSaleOffersModal(content) {
    this.saleOffersModal = this._modalService.open(content, {size: 'lg'});
    this.saleOfferDetails = null;
    this._web3.getTrustSaleOfferDetails(this.trustHash)
      .then((res: any) => {
        this.saleOfferDetails = res;
      })
  }

  agreeToOffer(sale_hash) {
    this._web3.activeAccount()
      .then(account => {
        this._web3.smartLawInstance.methods.agreeSaleOffer(this.trustHash, sale_hash)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            this._web3.showSuccess(hash);
            this.saleOffersModal.close();
          })
          .on('receipt', receipt => {
            //this.getTrusts();
          })
          .on('error', err => {
            this._web3.showError("Error agreeing to sale offer.");
            this.saleOffersModal.close();
          });
      })
      .catch(err => {
        this.saleOffersModal.close();
        this._web3.showError("Error getting default account.");
      })
  }

  submitSaleOffer() {
    this.offerSaleBtnStatus(true);
    this._web3.activeAccount()
      .then(account => {
        this._web3.smartLawInstance.methods.offerBeneficialInterestForSale(this.trustHash, this._web3.web3.utils.toWei(this.amount+'', 'ether'))
          .send({ from: account })
          .on('transactionHash', (hash) => {
            this.offerSaleBtnStatus(false);
            //this.getTrusts();
            this._web3.showSuccess(hash);
            this.saleOfferModal.close();
          })
          .on('receipt', receipt => {
            //this.getTrusts();
          })
          .on('error', err => {
            this._web3.showError("Error submitting sale offer.");
            this.saleOfferModal.close();
            this.offerSaleBtnStatus(false);
          });
      })
      .catch(err => {
        this.offerSaleBtnStatus(false);
        this.saleOfferModal.close();
        this._web3.showError("Error getting default account.");
      })
  }

  addNewBeneficiary() {
    this.newBeneficiaryBtnStatus(true);
    this._web3.activeAccount()
      .then(account => {
        this._web3.smartLawInstance.methods.assignBeneficialInterest(this.trustHash, this.newTrustBeneficiary)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            this.newBeneficiaryBtnStatus(false);
            this._web3.showSuccess(hash);
            this.newBeneficiaryModal.close();
          })
          .on('receipt', receipt => {
          })
          .on('error', err => {
            this._web3.showError("Error creating trust.");
            this.newBeneficiaryModal.close();
            this.newBeneficiaryBtnStatus(false);
          });
      })
      .catch(err => {
        this.newBeneficiaryBtnStatus(false);
        this.newBeneficiaryModal.close();
        this._web3.showError("Error getting default account.");
      })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.trustHash = params['hash'];
      this._web3.getTrust(this.trustHash)
        .then((res: any) => {
          this.trust = res;
        })
      this._web3.isTrustBeneficiary(this.trustHash)
        .then((res: any) => {
          this.isBeneficiary = res;
        });
      this._web3.getTrustBeneficiaries(this.trustHash)
        .then((res: any) => {
          this.beneficiaries = res;
        });
      this._web3.getTrustDissolveSignatures(this.trustHash)
        .then((res: any) => {
          this.dissolveSignatures = res;
        });
      this._web3.getTrustSaleOffers(this.trustHash)
        .then((res: any) => {
          this.saleOffers = res;
        });
    });
  }

}
