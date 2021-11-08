/**
 * baseManager.js
 * Last modified: 2021.11.04
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Database system based on sequelize.
 */

/* Modules */
const utility = require('@src/utils/utility');
const database = require('@src/database/database');
const logger = require('@src/utils/logger');

/**
 * @class BaseManager
 * @description This is the BaseManager class, which is used as the basis for the Manager class.
 */
class BaseManager {
    constructor() {}

    /**
     * @function getBaseObject
     * @description Clone the base object
     *
     * @param {Object} baseObj base object to clone.
     * @returns {Object} Cloned Base Object
     */
    getBaseObject(baseObj) {
        return utility.clone(baseObj, null);
    }

    /**
     * @function getModel
     * @description Get the specific sequelize model(table). ex) Vote, User, Account ...
     *
     * @param {string} modelName Specific model name.
     * @returns {Sequelize.Model} Sequelize model
     */
    getModel(modelName) {
        return database.models[modelName];
    }

    /**
     * @function getOp
     * @description Get sequelize operators
     *
     * @returns {Sequelize.Op} Sequelize operators
     */
    get getOp() {
        return database.Op;
    }

    /**
     * @async @function create
     * @description Create new tuple in database.
     *
     * @param {string} modelName Sequelize model name
     * @param {object} baseObj Base Object ex) AccountManager's baseAccountObject
     * @returns {object} Result object from database.
     */
    async create(modelName, baseObj) {
        try {
            await this.getModel(modelName).create(baseObj);
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @async @function find
     * @description Find an tuple in database which meet the conditions.
     *
     * @param {object} conditions query conditions.
     * @returns {object} Result object from database.
     */
    async find(modelName, queryObj) {
        let result = null;

        try {
            result = await this.getModel(modelName).findOne(queryObj);
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }

    /**
     * @async @function findAll
     * @description Find all tuples in database which meet the conditions.
     *
     * @param {object} conditions query conditions.
     * @returns {Array<object>} Result object array from database.
     */
    async findAll(modelName, queryObj) {
        let result = null;

        try {
            result = await this.getModel(modelName).findAll(queryObj);
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }

    /**
     * @async @function update
     * @description Update the tuple information in database.
     *
     * @param {object} contents contents to update.
     * @param {object} conditions query conditions.
     * @returns {boolean} result of update operation.
     */
    async update(modelName, contents, queryObj) {
        try {
            await this.getModel(modelName).update(contents, queryObj);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @async @function delete
     * @description Delete the tuple in database.
     *
     * @param {object} conditions query conditions.
     * @returns {boolean} Result of delete operation.
     */
    async delete(modelName, queryObj) {
        try {
            await this.getModel(modelName).destroy(queryObj);
            return true;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    /**
     * @async @function query
     * @description Execute a typical sql query.
     * @example
     * In async function ..
     * const queryStr = 'SELECT * FROM accounts WHERE snsId = -1;';
     * const result = await baseManager.query(queryStr);
     * ...
     *
     * @param {string} queryStr SQL query string. ex) SELECT * FROM accounts WHERE snsId = -1; (accounts table)
     * @returns {Sequelize.Model} Sequelize model
     */
    async query(queryStr) {
        let result = null;
        try {
            result = await this.getModel('sequelize').query(queryStr);
        } catch (err) {
            logger.error(err);
        } finally {
            return result;
        }
    }
}

/* Export the BaseManager class as Module */
module.exports = BaseManager;
