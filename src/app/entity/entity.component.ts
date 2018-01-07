import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Web3Service } from '../web3.service';
import _ from 'lodash';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  newEntityModal: any = null;
  entity: any = {
    category: 0,
    accreditedInvestor: false
  };
  entities: any = null;
  newEntityBtn: any = {
    caption: 'Create',
    isProcessing: false
  };

  constructor(
    private _zone: NgZone,
    private _web3: Web3Service,
    private _modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.getEntities();
  }

  getEntities() {
    this._web3.getEntities()
      .then((res: any) => {
        this.entities = res;
      })
  }

  open(content) {
    this.newBtnStatus(false);
    this.newEntityModal = this._modalService.open(content);
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

  verifyEntity(address, i) {
    this._zone.run(() => {
      this.entities[i].hasPendingVerification = true;
      this._web3.activeAccount()
        .then(account => {

          this._web3.smartLawInstance.methods.verifyLegalEntity(address)
            .send({ from: account })
            .on('transactionHash', (hash) => {
              this.getEntities();
              this._web3.showSuccess(hash);
            })
            .on('receipt', receipt => {
              this.getEntities();
            })
            .on('error', err => {
              this.entities[i].hasPendingVerification = false;
              this._web3.showError("Error verifying entity.");
            });

        })
        .catch(err => {
          this.entities[i].hasPendingVerification = false;
          this._web3.showError("Error getting default account.");
        })
    })
  }

  createNewEntity() {
    this.newBtnStatus(true);
    this._web3.activeAccount()
      .then(account => {
        this._web3.smartLawInstance.methods.newLegalEntity(this.entity.category, this.entity.accreditedInvestor)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            this.newBtnStatus(false);
            this.getEntities();
            this._web3.showSuccess(hash);
            this.newEntityModal.close();
          })
          .on('receipt', receipt => {
            this.getEntities();
          })
          .on('error', err => {
            this._web3.showError("Error creating entity.");
            this.newEntityModal.close();
            this.newBtnStatus(false);
          });
      })
      .catch(err => {
        this.newBtnStatus(false);
        this.newEntityModal.close();
        this._web3.showError("Error getting default account.");
      })
  }

}
