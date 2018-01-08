declare var require: any;
const Web3 = require('web3');
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import _ from 'lodash';

import { Injectable } from '@angular/core';

@Injectable()
export class Web3Service {

  public web3: any = null;
  smartLawContractAddress: string = '0xaB913350E8950c56d2c462306aFE98DB7442AEb2';
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
      [
        {
          "constant": true,
          "inputs": [
            {
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "getLegalEntity",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "bool"
            },
            {
              "name": "",
              "type": "address"
            },
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "TrustList",
          "outputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "countLegalEntity",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            },
            {
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isTrustBeneficiary",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            }
          ],
          "name": "getTrustSaleOffers",
          "outputs": [
            {
              "name": "",
              "type": "bytes32[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "LegalEntityList",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            }
          ],
          "name": "getTrustDissolveSignatures",
          "outputs": [
            {
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            }
          ],
          "name": "getTrustBeneficiaries",
          "outputs": [
            {
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            }
          ],
          "name": "getTrust",
          "outputs": [
            {
              "name": "",
              "type": "string"
            },
            {
              "name": "",
              "type": "string"
            },
            {
              "name": "",
              "type": "bool"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "countTrust",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            },
            {
              "name": "_sale_hash",
              "type": "bytes32"
            }
          ],
          "name": "getTrustSaleOfferDetail",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_entity",
              "type": "address"
            }
          ],
          "name": "LegalEntityCreated",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "verifyLegalEntity",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            },
            {
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "offerBeneficialInterestForSale",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "SmartDeed",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_trust",
              "type": "bytes32"
            }
          ],
          "name": "TrustCreated",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_name",
              "type": "string"
            },
            {
              "name": "_trustProperty",
              "type": "string"
            },
            {
              "name": "_beneficiary",
              "type": "address"
            }
          ],
          "name": "newTrust",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            },
            {
              "name": "_sale_hash",
              "type": "bytes32"
            }
          ],
          "name": "agreeSaleOffer",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            },
            {
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "assignBeneficialInterest",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            }
          ],
          "name": "buyBeneficialInterest",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_category",
              "type": "uint256"
            },
            {
              "name": "_accreditedInvestor",
              "type": "bool"
            }
          ],
          "name": "newLegalEntity",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_trust_hash",
              "type": "bytes32"
            }
          ],
          "name": "dissolveTrust",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
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

  async countLegalEntity() {
    return await this.smartLawInstance.methods.countLegalEntity().call();
  }

  async countTrust() {
    return await this.smartLawInstance.methods.countTrust().call();
  }

  async getEntitiesAddress() {
    let addresses = [];
    let count = await this.countLegalEntity();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        let address = await this.smartLawInstance.methods.LegalEntityList(i).call();
        addresses.push(address)
      }
    }
    return addresses;
  }

  async getEntities() {
    let entities = [];
    let count = await this.countLegalEntity();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        let address = await this.smartLawInstance.methods.LegalEntityList(i).call();
        let entity = await this.smartLawInstance.methods.getLegalEntity(address).call();
        entities.push({
          category: this.categoryStr[Number(entity[0])],
          verified: this.booleanStr[entity[1]],
          address: entity[2],
          accreditedInvestor: this.booleanStr[entity[3]],
          hasPendingVerification: entity[1]
        });
      }
    }
    return entities;
  }

  async getTrust(hash) {
    let trust = await this.smartLawInstance.methods.getTrust(hash).call();
    return {
      hash: hash,
      name: trust[0],
      property: trust[1],
      isForSale: this.booleanStr[trust[2]],
      amount: this.web3.utils.fromWei(trust[3], 'ether')
    };
  }

  async isTrustBeneficiary(hash) {
    let account = await this.activeAccount();
    return await this.smartLawInstance.methods.isTrustBeneficiary(hash, account).call();
  }

  async getTrustBeneficiaries(hash) {
    return await this.smartLawInstance.methods.getTrustBeneficiaries(hash).call();
  }

  async getTrustDissolveSignatures(hash) {
    return await this.smartLawInstance.methods.getTrustDissolveSignatures(hash).call();
  }

  async getTrustSaleOffers(hash) {
    return await this.smartLawInstance.methods.getTrustSaleOffers(hash).call();
  }

  async getTrustSaleOfferDetails(hash) {
    let account = await this.activeAccount();
    let saleHashes = await this.getTrustSaleOffers(hash);
    let saleOffers = [];
    if (saleHashes.length > 0) {
      for (let i = 0; i < saleHashes.length; i++) {
        let detail = await this.smartLawInstance.methods.getTrustSaleOfferDetail(hash, saleHashes[i]).call();
        saleOffers.push({
          hash: saleHashes[i],
          amount: this.web3.utils.fromWei(detail[0], 'ether'),
          signatures: detail[1],
          hasAgreed: detail && detail[1].indexOf(account) > -1
        });
      }
    }
    return saleOffers;
  }

  async getTrusts() {
    let trusts = [];
    let count = await this.countTrust();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        let hash = await this.smartLawInstance.methods.TrustList(i).call();
        let trust = null;
        try {
          trust = await this.smartLawInstance.methods.getTrust(hash).call();
        } catch(e) {}
        if(trust) {
          trusts.push({
            hash: hash,
            name: trust[0],
            property: trust[1],
            isForSale: this.booleanStr[trust[2]],
            amount: this.web3.utils.fromWei(trust[3], 'ether')
          });
        }
      }
    }
    return trusts;
  }

  async activeAccount() {
    let accounts = await this.web3.eth.getAccounts();
    console.log(accounts[0]);
    return accounts[0];
  }

  async isContractOwner() {
    let account = await this.activeAccount();
    let owner = await this.smartLawInstance.methods.owner().call();
    return account == owner;
  }

}
