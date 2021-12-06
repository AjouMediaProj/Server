/**
 * database.js
 * Last modified: 2021.11.22
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Database system based on sequelize.
 */

/* Modules */
require('dotenv').config();
const Sequelize = require('sequelize');
const BaseModel = require('@src/database/models/baseModel');
const type = require('@src/utils/type');
const logger = require('@src/utils/logger');

/* Constants */
const nodeEnv = process.env.NODE_ENV || 'development';
const dbConfig = require('@root/config/config').sequelize[nodeEnv];

/* Models Object */
const models = Object.freeze({
    Account: require('@root/src/database/models/account'),
    User: require('@src/database/models/user'),
    Candidate: require('@src/database/models/candidate'),
    Vote: require('@src/database/models/vote'),
    VoteRecord: require('@src/database/models/voteRecord'),
    AuthMail: require('@src/database/models/authMail'),
});

/* Sequelize Object */
const sequelize = Object.freeze(new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig));

/**
 * @class Database
 * @description
 */
class Database {
    /**
     * @async @function init
     * @description Initialize the sequelize.
     *
     * @param {Boolean} force If true, drop and create all tables in mysql
     * @param {Boolean} logging If true, log the sql queries.
     */
    async init(force = false, logging = false) {
        try {
            // Initialize the models
            models.Account.init(sequelize);
            models.User.init(sequelize);
            models.Candidate.init(sequelize);
            models.Vote.init(sequelize);
            models.VoteRecord.init(sequelize);
            models.AuthMail.init(sequelize);

            // Sync the sequelize
            await sequelize.sync({ force, logging });
            logger.info('Initialize the database [Sequelize]');
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * @getter sequelize
     * @description Get sequelize instance. (readonly)
     */
    get sequelize() {
        return sequelize;
    }

    /**
     * @getter Op
     * @description Get Sequelize query operator.
     */
    get Op() {
        return Sequelize.Op;
    }

    /**
     * @function getModel
     * @description Get specific sequelize model
     *
     * @returns {typeof BaseModel}
     */
    getModel(modelName) {
        const model = models[modelName];
        if (model === undefined) return null;
        else return model;
    }

    /**
     * @async @function execQuery
     * @description Execute sequelize query based on type.QueryObject
     *
     * @param {type.QueryObject} q Query object based on type.QueryObject
     * @param {Sequelize.Transaction} t Instance sequelize transaction ( can get sequelize.transaction() )
     * @throws {error}
     * @returns {object}
     */
    async execQuery(q, t = null) {
        const model = this.getModel(q.model);
        if (model === undefined) throw new Error('Undefined Model Type');

        let result = null;
        try {
            switch (q.method) {
                case type.QueryMethods.create:
                    result = await model.create(q.data, t);
                    break;

                case type.QueryMethods.findOne:
                    result = await model.findOne(q.conditions, t);
                    break;

                case type.QueryMethods.findAll:
                    result = await model.findAll(q.conditions, t);
                    break;

                case type.QueryMethods.update:
                    result = await model.update(q.data, q.conditions, t);
                    break;

                case type.QueryMethods.delete:
                    result = await model.delete(q.conditions, t);
                    break;

                default:
                    throw new Error('Undefined Query Type Error');
            }

            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @async @function execTransaction
     * @description Process all queries using transaction. If any of the queries fails, the transaction is rolled back.
     *
     * @param {Array<type.QueryObject>} queryObjArr Array of query object based on Type.QueryObject
     * @returns {boolean}
     * @throws {error}
     */
    async execTransaction(queryObjArr) {
        // begin transaction
        const t = await sequelize.transaction();

        try {
            for (let q of queryObjArr) await this.execQuery(q, t);
            await t.commit();
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }
}

/* Export object as module */
module.exports = new Database();
