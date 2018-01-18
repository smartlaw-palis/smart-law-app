declare var require: any;
const Web3 = require('web3');
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import _ from 'lodash';

import { Injectable } from '@angular/core';


import * as SmartLawTrustContract from './contracts/SmartLawTrust.json';
import * as TrustContract from './contracts/Trust.json';
import * as EntityContract from './contracts/Entity.json';
import * as BeneficiaryContract from './contracts/Beneficiary.json';
import * as SaleContract from './contracts/Sale.json';

@Injectable()
export class Web3Service {

  public web3: any = null;
  smartLawContractAddress: string = '0x3154E7c003039A27dB8404Ed95cBAA68A4051e5E';
  public smartLawInstance: any = null;

  categoryStr = [
    'Individual',
    'LLC',
    'C Corp.',
    'S Corp.',
    'LLP',
    'Trust'
  ];

  booleanStr = {
    false: 'No',
    true: 'Yes'
  };

  constructor(
    private _toastyService: ToastyService,
    private _toastyConfig: ToastyConfig,
  ) {

    this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
    this.smartLawInstance = new this.web3.eth.Contract(
      (<any>SmartLawTrustContract).abi,
      this.smartLawContractAddress
    );

  }

  showError(msg: string) {
    this._toastyConfig.theme = 'bootstrap';
    var toastOptions: ToastOptions = {
      title: "Message",
      msg: msg,
      showClose: true,
      timeout: 10000
    };
    this._toastyService.error(toastOptions);
  }

  showSuccess(msg: string) {
    this._toastyConfig.theme = 'bootstrap';
    var toastOptions: ToastOptions = {
      title: "Message",
      msg: msg,
      showClose: true,
      timeout: 10000
    };
    this._toastyService.success(toastOptions);
  }

  async entityAddresses() {
    return await this.smartLawInstance.methods.entityAddresses().call();
  }

  async trustAddresses() {
    return await this.smartLawInstance.methods.trustAddresses().call();
  }

  createEntityInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>EntityContract).abi,
      _address
    );
  }

  createTrustInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>TrustContract).abi,
      _address
    );
  }

  createSaleInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>SaleContract).abi,
      _address
    );
  }

  createBeneficiaryInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>BeneficiaryContract).abi,
      _address
    );
  }

  async getEntities() {
    let entities = [];
    let addresses = await this.entityAddresses();
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        let entityInstance = await this.createEntityInstance(addresses[i]);
        let verified = await entityInstance.methods.verified().call();
        entities.push({
          category: this.categoryStr[await entityInstance.methods.category().call()],
          verified: this.booleanStr[verified],
          owner: await entityInstance.methods.owner().call(),
          address: addresses[i],
          accreditedInvestor: this.booleanStr[await entityInstance.methods.isAccreditedInvestor().call()],
          hasPendingVerification: verified
        });
      }
    }
    return entities;
  }

  async getTrustDetails(_address) {
    let account = await this.activeAccount();
    let entity = await this.smartLawInstance.methods.entityAddress(account).call();
    let trustInstance = await this.createTrustInstance(_address);
    let dissolveSignatures = await trustInstance.methods.getDissolveSignatures().call();
    return {
      name: await trustInstance.methods.name().call(),
      property: await trustInstance.methods.property().call(),
      deleted: await trustInstance.methods.deleted().call(),
      address: _address,
      forSale: this.booleanStr[await trustInstance.methods.forSale().call()],
      amount: this.web3.utils.fromWei(await trustInstance.methods.forSaleAmount().call() + '', 'ether'),
      dissolveSignatures: dissolveSignatures,
      signedDissolve: dissolveSignatures.indexOf(entity) > -1,
      beneficiaries: await trustInstance.methods.beneficiariesSignatures().call(),
      saleOffers: await this.getTrustSaleOffers(_address),
      pendingBeneficiaries: await this.getTrustPendingBeneficiaries(_address)
    };
  }

  async isTrustBeneficiary(_address) {
    let account = await this.activeAccount();
    let entity = await this.smartLawInstance.methods.entityAddress(account).call();
    let trustInstance = await this.createTrustInstance(_address);
    return await trustInstance.methods.isBeneficiary(entity).call();
  }

  async getTrustBeneficiaries(_address) {
    let trustInstance = await this.createTrustInstance(_address);
    return await trustInstance.methods.beneficiariesSignatures().call();
  }

  async getTrustDissolveSignatures(hash) {
    return await this.smartLawInstance.methods.getTrustDissolveSignatures(hash).call();
  }

  async getTrustSaleOffers(_address) {
    let account = await this.activeAccount();
    let entity = await this.smartLawInstance.methods.entityAddress(account).call();
    let trustInstance = await this.createTrustInstance(_address);
    let addresses = await trustInstance.methods.saleOffers().call();
    let saleOffers = [];

    for(let i = 0; i < addresses.length; i++) {
      let saleInstance =  await this.createSaleInstance(addresses[i]);
      let disabled = await saleInstance.methods.disabled().call();
      if(!disabled) {
        let signatures = await saleInstance.methods.getSignatures().call();
        saleOffers.push({
          address: addresses[i],
          amount: this.web3.utils.fromWei(await saleInstance.methods.amount().call() + '', 'ether'),
          signatures: signatures,
          hasAgreed: signatures.indexOf(entity) > -1
        })
      }
    }
    return saleOffers;
  }

  async getTrustPendingBeneficiaries(_address) {
    let account = await this.activeAccount();
    let entity = await this.smartLawInstance.methods.entityAddress(account).call();
    let trustInstance = await this.createTrustInstance(_address);
    let addresses = await trustInstance.methods.getPendingBeneficiaries().call();
    let pendingBeneficiaries = [];
    for(let i = 0; i < addresses.length; i++) {
      let beneficiaryInstance =  await this.createBeneficiaryInstance(addresses[i]);
      let disabled = await beneficiaryInstance.methods.disabled().call();
      if(!disabled) {
        let signatures = await beneficiaryInstance.methods.getSignatures().call();
        pendingBeneficiaries.push({
          address: addresses[i],
          entity: await beneficiaryInstance.methods.entity().call(),
          signatures: signatures,
          hasAgreed: signatures.indexOf(entity) > -1
        });
      }
    }
    return pendingBeneficiaries;
  }

  async getTrusts() {
    let trusts = [];
    let addresses = await this.trustAddresses();
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        let trustInstance = await this.createTrustInstance(addresses[i]);
        let deleted = await trustInstance.methods.deleted().call();
        if(!deleted) {
          trusts.push({
            name: await trustInstance.methods.name().call(),
            property: await trustInstance.methods.property().call(),
            address: addresses[i],
            forSale: this.booleanStr[await trustInstance.methods.forSale().call()],
            amount: await trustInstance.methods.forSaleAmount().call(),
          });
        }
      }
    }
    return trusts;
  }

  async activeAccount() {
    let accounts = await this.web3.eth.getAccounts();
    console.log(`Active account: ${accounts[0]}`);
    return accounts[0];
  }

  async isContractOwner() {
    let account = await this.activeAccount();
    let owner = await this.smartLawInstance.methods.owner().call();
    console.log(`Owner: ${owner}`)
    return account == owner;
  }

  async isContractNewOwner() {
    let account = await this.activeAccount();
    let newOwner = await this.smartLawInstance.methods.newOwner().call();
    console.log(`newOwner: ${newOwner}`)
    return account == newOwner;
  }

  async isEntityOwner() {
    let account = await this.activeAccount();
    return await this.smartLawInstance.methods.isEntityOwner(account).call();
  }

  async availableFunds() {
    let account = await this.activeAccount();
    let entity = await this.smartLawInstance.methods.entityAddress(account).call();
    let entityInstance = await this.createEntityInstance(entity);
    let funds = 0;

    try {
      funds = this.web3.utils.fromWei(await entityInstance.methods.availableFunds().call({from: account}) + '', 'ether');
    } catch(err) {}
    return funds;
  }

  async accountEntityAddress() {
    let account = await this.activeAccount();
    return await this.smartLawInstance.methods.entityAddress(account).call();
  }

}
