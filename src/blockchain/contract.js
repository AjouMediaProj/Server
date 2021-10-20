//@ts-check

/**
 * contract.js
 * Last modified: 2021.10.19
 * Author: Han Kyu Hyeon
 * Description: Klaytn Contract Manager
 */

/* Modules */
const Caver = require('caver-js');

/* Utils */
const klaytnConfig = require('@root/config/klaytn-config');
const utility = require('@src/utils/utility');
const logger = require('@src/utils/logger');

const CONTRACT_FUNC = {
    addVote: 'addVote',
    addCandidate: 'addCandidate',

    vote: 'vote',

    getVote: 'getVote',
    getCandidate: 'getCandidate',
};

const CONTRACT_EVENT = {
    addVote: 'AddVote',
    addCandidate: 'AddCandidate',
};

/**
 * @class UserManager
 * @description
 */
class Contract {
    constructor() {
        this.caver = null;

        this.deployer = null;
        this.feePayer = null;

        this.contract = null;
        this.voteContract = null;
    }

    /**
     * @function init
     * @description Initialize Klaytn contract setting
     *
     */
    init() {
        const caver = new Caver(klaytnConfig.api);

        const deployer = caver.wallet.keyring.createFromPrivateKey(klaytnConfig.privateKey);
        caver.wallet.add(deployer);

        const feePayer = caver.wallet.keyring.createFromPrivateKey(klaytnConfig.feePayerPrivateKey);
        caver.wallet.add(feePayer);
        caver.klay.defaultAccount = feePayer.address;

        const contract = caver.contract.create(klaytnConfig.abi, klaytnConfig.contractAddress);
        const voteContract = new caver.klay.Contract(klaytnConfig.abi, klaytnConfig.contractAddress);

        this.caver = caver;
        this.deployer = deployer;
        this.feePayer = feePayer;
        this.contract = contract;
        this.voteContract = voteContract;

        const isDev = (process.env.NODE_ENV || 'development') === 'development';
        if (isDev == true) {
            this.faucet(deployer._address);
        }
    }

    /**
     * @function before
     * @description Verify contract before logic start.
     * @todo Errors should be defined.
     *
     */
    before() {
        if (this.caver == null || this.deployer == null || this.feePayer == null || this.contract == null || this.voteContract == null) {
            throw 'err: contract is not initialized'; // @todo
        }
    }

    /**
     * @function signContract
     * @description Generate signed data of contract.
     *
     * @param  {string} funcName Contract function to Sign
     * @param  {...any} params Parameters of the function
     * @returns {Promise<Object>} FeeDelegatedSmartContractExecution
     */
    async signContract(funcName, ...params) {
        this.before();

        const signed = await this.contract.sign(
            {
                from: this.deployer.address,
                feeDelegation: true,
                gas: 1500000,
            },
            funcName,
            ...params,
        );

        await this.caver.wallet.signAsFeePayer(this.feePayer.address, signed);

        return signed;
    }

    /**
     * @function eventResponse
     * @description Get input data from past events.
     * @todo Errors should be defined.
     *
     * @param {string} eventName
     * @param {any} receipt
     * @returns
     */
    async eventResponse(eventName, receipt) {
        this.before();

        const rtn = await this.voteContract.getPastEvents(eventName, {
            filter: { myIndexedParam: [receipt.transactionIndex] },
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
        });

        if (rtn == null || rtn[0] == null || rtn[0].returnValues == null) {
            throw 'err: invalid receipt'; // @todo
        }

        return rtn[0].returnValues;
    }

    /**
     * @function addVote
     * @description Send addVote transaction.
     *
     * @param {string} voteName
     * @param {number} startTime
     * @param {number} endTime
     * @returns
     */
    async addVote(voteName, startTime, endTime) {
        let rtn = {
            idx: 0,
            name: '',
            startTime: 0,
            endTime: 0,
        };

        const signedData = await this.signContract(CONTRACT_FUNC.addVote, voteName, startTime, endTime);
        const receipt = await this.caver.rpc.klay.sendRawTransaction(signedData);
        const res = await this.eventResponse(CONTRACT_EVENT.addVote, receipt);

        utility.merge(res, rtn);

        return rtn;
    }

    /**
     * @function faucet
     * @description Faucet Klay. Receive 5 Klay. Only used in baobab network.
     *
     * @param {string} to klaytn wallet address
     */
    async faucet(to) {
        const uri = 'https://api-baobab.wallet.klaytn.com/faucet/run?address=' + to;
        await utility.requestHTTP(uri);
    }
}

/* Export object as module */
module.exports = new Contract();
