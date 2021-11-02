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
     * @private
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
     * @private
     * @function signContract
     * @description Generate signed data of contract.
     *
     * @param  {string} funcName Contract function to Sign
     * @param  {...any} params Parameters of the function
     * @returns {Promise<Object>} signedTransaction
     */
    async signContract(funcName, ...params) {
        this.before();

        let signed = null;

        try {
            signed = await this.contract.sign(
                {
                    from: this.deployer.address,
                    feeDelegation: true,
                    gas: 1500000,
                },
                funcName,
                ...params,
            );

            await this.caver.wallet.signAsFeePayer(this.feePayer.address, signed);
        } catch (err) {
            throw 'err: contract exception'; // @todo
        }

        return signed;
    }

    /**
     * @private
     * @function sendTransaction
     * @description Send raw transaction with signed data.
     *
     * @param  {object} signedData signedTransaction
     * @returns {Promise<Object>} TransactionReceipt
     */
    async sendTransaction(signedData) {
        this.before();

        let receipt = null;

        try {
            receipt = await this.caver.rpc.klay.sendRawTransaction(signedData);
        } catch (err) {
            throw 'err: contract exception'; // @todo
        }

        return receipt;
    }

    /**
     * @private
     * @function getTransactionReceipt
     * @description Get transaction receipt with hash.
     *
     * @param  {object} transactionHash
     * @returns {Promise<Object>} TransactionReceipt
     */
    async getTransactionReceipt(transactionHash) {
        this.before();

        let receipt = null;

        try {
            receipt = await this.caver.rpc.klay.getTransactionReceipt(transactionHash);
        } catch (err) {
            throw 'err: contract exception'; // @todo
        }

        return receipt;
    }

    /**
     * @private
     * @function decodeParameters
     * @description Decodes ABI encoded parameters.
     *
     * @param  {Array<object>} typesArray
     * @param  {string} hexstring
     * @returns {Promise<Object>} TransactionReceipt
     */
    async decodeParameters(typesArray, hexstring) {
        this.before();

        let rtn = null;

        try {
            rtn = await await this.caver.abi.decodeParameters(typesArray, hexstring);
        } catch (err) {
            throw 'err: contract exception'; // @todo
        }

        return rtn;
    }

    /**
     * @private
     * @function callContract
     * @description Get data from contract.
     *
     * @param  {string} funcName Contract function to Call
     * @param  {...any} params Parameters of the function
     * @returns {Promise<Object>} Response data from contract
     */
    async callContract(funcName, ...params) {
        this.before();

        let rtn = null;

        try {
            rtn = await this.contract.call(funcName, ...params);
        } catch (err) {
            throw 'err: contract exception'; // @todo
        }

        return rtn;
    }

    /**
     * @private
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

        let rtn = null;

        try {
            rtn = await this.voteContract.getPastEvents(eventName, {
                filter: { myIndexedParam: [receipt.transactionIndex] },
                fromBlock: receipt.blockNumber,
                toBlock: receipt.blockNumber,
            });
        } catch (err) {
            throw 'err: contract exception'; // @todo
        }

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
        const receipt = await this.sendTransaction(signedData);
        const res = await this.eventResponse(CONTRACT_EVENT.addVote, receipt);

        utility.merge(res, rtn);

        return rtn;
    }

    /**
     * @function addCandidate
     * @description Send addCandidate transaction.
     *
     * @param {number} voteIdx
     * @param {string} candName
     * @returns
     */
    async addCandidate(voteIdx, candName) {
        let rtn = {
            idx: 0,
            name: '',
        };

        const signedData = await this.signContract(CONTRACT_FUNC.addCandidate, voteIdx, candName);
        const receipt = await this.sendTransaction(signedData);
        const res = await this.eventResponse(CONTRACT_EVENT.addCandidate, receipt);

        utility.merge(res, rtn);

        return rtn;
    }

    /**
     * @function addCandidate
     * @description Send addCandidate transaction.
     *
     * @param {number} voteIdx
     * @param {number} candIdx
     * @param {boolean} renounce
     * @returns
     */
    async vote(voteIdx, candIdx, renounce) {
        let rtn = {
            receipt: '',
        };

        const signedData = await this.signContract(CONTRACT_FUNC.vote, voteIdx, candIdx, renounce);
        const receipt = await this.sendTransaction(signedData);

        rtn.receipt = receipt.transactionHash;

        return rtn;
    }

    /**
     * @function getVote
     * @description Get vote data.
     *
     * @param {number} voteIdx
     * @returns
     */
    async getVote(voteIdx) {
        let rtn = {
            voteIdx: 0,
            voteName: '',
            candIdxes: [],
            totalVoteCnt: 0,
            startTime: 0,
            endTime: 0,
            status: 0,
        };

        const res = await this.callContract(CONTRACT_FUNC.getVote, voteIdx);

        utility.merge(res, rtn);

        return rtn;
    }

    /**
     * @function getCandidate
     * @description Get candidate data.
     *
     * @param {number} candIdx
     * @returns
     */
    async getCandidate(candIdx) {
        let rtn = {
            candIdx: 0,
            candName: '',
            voteCnt: 0,
        };

        const res = await this.callContract(CONTRACT_FUNC.getCandidate, candIdx);

        utility.merge(res, rtn);

        return rtn;
    }

    /**
     * @function decodeVoteReceipt
     * @description Decode vote receipt.
     *
     * @param {string} transactionHash
     * @returns
     */
    async decodeVoteReceipt(transactionHash) {
        let rtn = {
            voteIdx: 0,
            candIdx: 0,
            renounce: false,
        };

        const receipt = await this.getTransactionReceipt(transactionHash);

        const typesArray = klaytnConfig.abi.find((x) => x.name == CONTRACT_FUNC.vote).inputs;
        const res = await this.decodeParameters(typesArray, receipt.input.slice(10));

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
