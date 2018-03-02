declare var require: any;
const Web3 = require('web3');
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import _ from 'lodash';
import * as moment from 'moment';

import { Injectable } from '@angular/core';


import * as LiquidREContract from './contracts/LiquidRE.json';
import * as DexREContract from './contracts/DexRE.json';
import * as TrusteeContract from './contracts/Trustee.json';
import * as EntityContract from './contracts/Entity.json';
import * as IREOContract from './contracts/IREO.json';
import * as TrusteeFactoryContract from './contracts/TrusteeFactory.json';
import * as EntityFactoryContract from './contracts/EntityFactory.json';

@Injectable()
export class Web3Service {

  public web3: any = null;
  public addresses: any = {
    LiquidRE: '0x8ba41a5634d05337a697f593a4f58ab3b4032418',
    DexRE: '',
    TrusteeFactory: '0xf52b21007d0617663c33595c4d3b75a3145fc39b',
    EntityFactory: '0xb1ae369709353c81b37261af0a45d90b19a7fdeb'
  };
  public LiquidREInstance: any = null;
  public TrusteeFactoryInstance: any = null;
  public EntityFactoryInstance: any = null;

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
    this.TrusteeFactoryInstance = new this.web3.eth.Contract(
      (<any>TrusteeFactoryContract).abi,
      this.addresses['TrusteeFactory']
    );
    this.EntityFactoryInstance = new this.web3.eth.Contract(
      (<any>EntityFactoryContract).abi,
      this.addresses['EntityFactory']
    );
    this.LiquidREInstance = new this.web3.eth.Contract(
      (<any>LiquidREContract).abi,
      this.addresses['LiquidRE']
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
    return await this.EntityFactoryInstance.methods.entityAddresses().call();
  }

  async trusteeAddresses() {
    return await this.TrusteeFactoryInstance.methods.trusteeAddresses().call();
  }

  async ireoAddresses() {
    return await this.LiquidREInstance.methods.IREOsAddresses().call();
  }

  // async trustAddresses() {
  //   return await this.smartLawInstance.methods.trustAddresses().call();
  // }

  createEntityInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>EntityContract).abi,
      _address
    );
  }

  createTrusteeInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>TrusteeContract).abi,
      _address
    );
  }

  createIREOInstance(_address) {
    return new this.web3.eth.Contract(
      (<any>IREOContract).abi,
      _address
    );
  }

  // createTrustInstance(_address) {
  //   return new this.web3.eth.Contract(
  //     (<any>TrustContract).abi,
  //     _address
  //   );
  // }
  //
  // createSaleInstance(_address) {
  //   return new this.web3.eth.Contract(
  //     (<any>SaleContract).abi,
  //     _address
  //   );
  // }
  //
  // createBeneficiaryInstance(_address) {
  //   return new this.web3.eth.Contract(
  //     (<any>BeneficiaryContract).abi,
  //     _address
  //   );
  // }

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
          country: await entityInstance.methods.country().call(),
          address: addresses[i],
          accreditedInvestor: this.booleanStr[await entityInstance.methods.isAccreditedInvestor().call()],
          hasPendingVerification: verified
        });
      }
    }
    return entities;
  }

  async getTrustees() {
    let trustees = [];
    let addresses = await this.trusteeAddresses();
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        trustees.push(await this.getTrustee(addresses[i]));
      }
    }
    return trustees;
  }

  async getTrustee(_address) {
    let trusteeInstance = await this.createTrusteeInstance(_address);
    return {
      owner: await trusteeInstance.methods.owner().call(),
      name: await trusteeInstance.methods.name().call(),
      address: _address,
    };
  }

  async getIREOs() {
    let ireos = [];
    let addresses = await this.ireoAddresses();
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        let ireoInstance = await this.createIREOInstance(addresses[i]);
        let trustee = await ireoInstance.methods.trustee().call();

        ireos.push({
          trustee: await this.getTrustee(trustee),
          entity: await ireoInstance.methods.entity().call(),
          startTime: moment.unix(await ireoInstance.methods.startTime().call()).format('MMM DD, YYYY hh:ss:mm A'),
          endTime: moment.unix(await ireoInstance.methods.endTime().call()).format('MMM DD, YYYY hh:ss:mm A'),
          goal: this.web3.utils.fromWei(await ireoInstance.methods.fundingGoal().call(), 'ether'),
          price: this.web3.utils.fromWei(await ireoInstance.methods.price().call(), 'ether'),
          status: await ireoInstance.methods.status().call(),
          raised: await ireoInstance.methods.amountRaised().call(),
          address: addresses[i],
        });
      }
    }
    return ireos;
  }

  // async getTrustDetails(_address) {
  //   let account = await this.activeAccount();
  //   let entity = await this.smartLawInstance.methods.entityAddress(account).call();
  //   let trustInstance = await this.createTrustInstance(_address);
  //   let dissolveSignatures = await trustInstance.methods.getDissolveSignatures().call();
  //   return {
  //     name: await trustInstance.methods.name().call(),
  //     property: await trustInstance.methods.property().call(),
  //     deleted: await trustInstance.methods.deleted().call(),
  //     address: _address,
  //     forSale: this.booleanStr[await trustInstance.methods.forSale().call()],
  //     amount: this.web3.utils.fromWei(await trustInstance.methods.forSaleAmount().call() + '', 'ether'),
  //     dissolveSignatures: dissolveSignatures,
  //     signedDissolve: dissolveSignatures.indexOf(entity) > -1,
  //     beneficiaries: await trustInstance.methods.beneficiariesSignatures().call(),
  //     saleOffers: await this.getTrustSaleOffers(_address),
  //     pendingBeneficiaries: await this.getTrustPendingBeneficiaries(_address)
  //   };
  // }
  //
  // async isTrustBeneficiary(_address) {
  //   let account = await this.activeAccount();
  //   let entity = await this.smartLawInstance.methods.entityAddress(account).call();
  //   let trustInstance = await this.createTrustInstance(_address);
  //   return await trustInstance.methods.isBeneficiary(entity).call();
  // }
  //
  // async getTrustBeneficiaries(_address) {
  //   let trustInstance = await this.createTrustInstance(_address);
  //   return await trustInstance.methods.beneficiariesSignatures().call();
  // }
  //
  // async getTrustDissolveSignatures(hash) {
  //   return await this.smartLawInstance.methods.getTrustDissolveSignatures(hash).call();
  // }
  //
  // async getTrustSaleOffers(_address) {
  //   let account = await this.activeAccount();
  //   let entity = await this.smartLawInstance.methods.entityAddress(account).call();
  //   let trustInstance = await this.createTrustInstance(_address);
  //   let addresses = await trustInstance.methods.saleOffers().call();
  //   let saleOffers = [];
  //
  //   for(let i = 0; i < addresses.length; i++) {
  //     let saleInstance =  await this.createSaleInstance(addresses[i]);
  //     let disabled = await saleInstance.methods.disabled().call();
  //     if(!disabled) {
  //       let signatures = await saleInstance.methods.getSignatures().call();
  //       saleOffers.push({
  //         address: addresses[i],
  //         amount: this.web3.utils.fromWei(await saleInstance.methods.amount().call() + '', 'ether'),
  //         signatures: signatures,
  //         hasAgreed: signatures.indexOf(entity) > -1
  //       })
  //     }
  //   }
  //   return saleOffers;
  // }
  //
  // async getTrustPendingBeneficiaries(_address) {
  //   let account = await this.activeAccount();
  //   let entity = await this.smartLawInstance.methods.entityAddress(account).call();
  //   let trustInstance = await this.createTrustInstance(_address);
  //   let addresses = await trustInstance.methods.getPendingBeneficiaries().call();
  //   let pendingBeneficiaries = [];
  //   for(let i = 0; i < addresses.length; i++) {
  //     let beneficiaryInstance =  await this.createBeneficiaryInstance(addresses[i]);
  //     let disabled = await beneficiaryInstance.methods.disabled().call();
  //     if(!disabled) {
  //       let signatures = await beneficiaryInstance.methods.getSignatures().call();
  //       pendingBeneficiaries.push({
  //         address: addresses[i],
  //         entity: await beneficiaryInstance.methods.entity().call(),
  //         signatures: signatures,
  //         hasAgreed: signatures.indexOf(entity) > -1
  //       });
  //     }
  //   }
  //   return pendingBeneficiaries;
  // }
  //
  // async getTrusts() {
  //   let trusts = [];
  //   let addresses = await this.trustAddresses();
  //   if (addresses.length > 0) {
  //     for (let i = 0; i < addresses.length; i++) {
  //       let trustInstance = await this.createTrustInstance(addresses[i]);
  //       let deleted = await trustInstance.methods.deleted().call();
  //       if(!deleted) {
  //         trusts.push({
  //           name: await trustInstance.methods.name().call(),
  //           property: await trustInstance.methods.property().call(),
  //           address: addresses[i],
  //           forSale: this.booleanStr[await trustInstance.methods.forSale().call()],
  //           amount: await trustInstance.methods.forSaleAmount().call(),
  //         });
  //       }
  //     }
  //   }
  //   return trusts;
  // }
  //
  async activeAccount() {
    let accounts = await this.web3.eth.getAccounts();
    console.log(`Active account: ${accounts[0]}`);
    return accounts[0];
  }

  async isContractOwner() {
    let account = await this.activeAccount();
    let owner = await this.LiquidREInstance.methods.owner().call();
    console.log(`Owner: ${owner}`)
    return account == owner;
  }

  async isContractNewOwner() {
    let account = await this.activeAccount();
    let newOwner = await this.LiquidREInstance.methods.newOwner().call();
    console.log(`newOwner: ${newOwner}`)
    return account == newOwner;
  }

  async isEntityOwner() {
    let account = await this.activeAccount();
    return await this.EntityFactoryInstance.methods.isEntityOwner(account).call();
  }

  async isTrusteeOwner() {
    let account = await this.activeAccount();
    return await this.TrusteeFactoryInstance.methods.isTrusteeOwner(account).call();
  }

  async isTrustee(_address) {
    return await this.TrusteeFactoryInstance.methods.isTrustee(_address).call();
  }

  async availableFunds() {
    let account = await this.activeAccount();
    let entity = await this.EntityFactoryInstance.methods.entityAddress(account).call();
    let entityInstance = await this.createEntityInstance(entity);
    let funds = 0;

    try {
      funds = this.web3.utils.fromWei(await entityInstance.methods.availableFunds().call({ from: account }) + '', 'ether');
    } catch (err) { }
    return funds;
  }

  async accountEntityAddress() {
    let account = await this.activeAccount();
    return await this.EntityFactoryInstance.methods.entityAddress(account).call();
  }

}
