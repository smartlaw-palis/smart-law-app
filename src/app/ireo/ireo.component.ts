import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Web3Service } from '../web3.service';
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-ireo',
  templateUrl: './ireo.component.html',
  styleUrls: ['./ireo.component.scss']
})
export class IreoComponent implements OnInit {

    newIREOModal: any = null;
    ireo: any = {
      trustee: '0x13AC8Cc9febea1dFCeF77B73cc5AA67b60641A70',
      startTime: '2018-03-01T01:00:00.000',
      endTime: '2018-03-15T01:00:00.000',
      goal: 1000000,
      price: 0.01
    };
    ireos: any = null;
    trustees: any = null;
    newIREOBtn: any = {
      caption: 'Create',
      isProcessing: false
    };

    constructor(
      private _web3: Web3Service,
      private _modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.getIREOs();
        this.getTrustees();
    }

    getTrustees() {
        this._web3.getTrustees()
            .then((res: any) => {
              this.trustees = res;
            })
    }

    getIREOs() {
      this._web3.getIREOs()
        .then((res: any) => {
          this.ireos = res;
        })
    }

    open(content) {
      this.newBtnStatus(false);
      this.newIREOModal = this._modalService.open(content);
    }

    private newBtnStatus(status) {
      if (status) {
        this.newIREOBtn.caption = "Processing...";
        this.newIREOBtn.isProcessing = true;
      } else {
        this.newIREOBtn.caption = "Create";
        this.newIREOBtn.isProcessing = false;
      }
    }

    createNewIREO() {
      this.newBtnStatus(true);
      let goal = (this._web3.web3.utils.toWei(this.ireo.goal+'', 'ether')).valueOf();
      let price = (this._web3.web3.utils.toWei(this.ireo.price+'', 'ether')).valueOf();
      let startTime = moment(this.ireo.startTime).valueOf();
      let endTime = moment(this.ireo.endTime).valueOf();
      console.log(goal, price);
      this._web3.activeAccount()
        .then(account => {
          return this._web3.LiquidREInstance.methods.newIREO(this.ireo.trustee, startTime, endTime, goal, price)
            .send({ from: account })
        })
        .then(receipt => {
          this.getTrustees();
          this.newBtnStatus(false);
          this.newIREOModal.close();
          this._web3.showSuccess(receipt.transactionHash);
        })
        .catch(err => {
            console.log(err)
          this.newBtnStatus(false);
          this.newIREOModal.close();
          this._web3.showError(err);
        })
    }

}
