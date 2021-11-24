/**
 * database.js
 * Last modified: 2021.11.22
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Database system based on sequelize.
 */

/* Modules */
require('dotenv').config();
const Sequelize = require('sequelize');
const Type = require('@src/utils/type');
const logger = require('@src/utils/logger');

/* Constants */
const nodeEnv = process.env.NODE_ENV || 'development';
const dbConfig = require('@root/config/config').sequelize[nodeEnv];

/* Models Object */
const models = {
    Account: require('@root/src/database/models/account'),
    User: require('@src/database/models/user'),
    Candidate: require('@src/database/models/candidate'),
    Vote: require('@src/database/models/vote'),
    VoteRecord: require('@src/database/models/voteRecord'),
    AuthMail: require('@src/database/models/authMail'),
};

/* Sequelize Object */
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

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
            logger.info('[Sequelize]: Initialize the database.');
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
     * @getter models
     * @description Get models object. (readonly)
     */
    get models() {
        return models;
    }

    /**
     * @async @function execQuery
     * @description Execute sequelize query based on Type.QueryObject
     *
     * @param {Type.QueryObject} q Query object based on Type.QueryObject
     * @param {Sequelize.Transaction} t Instance sequelize transaction ( can get sequelize.transaction() )
     * @returns
     */
    async execQuery(q, t = null) {
        const model = this.models[q.modelName];
        if (model === undefined) throw new Error('Undefined Model Type');

        let result = null;
        try {
            if (t) q.conditions.transaction = t;

            switch (q.type) {
                case Type.QueryType.create:
                    if (t) result = await model.create(q.data, { transaction: t });
                    else result = await model.create(q.data);
                    break;

                case Type.QueryType.findOne:
                    result = await model.findOne(q.conditions);
                    break;

                case Type.QueryType.findAll:
                    result = await model.findAll(q.conditions);
                    break;

                case Type.QueryType.update:
                    result = await model.update(q.data, q.conditions);
                    break;

                case Type.QueryType.delete:
                    result = await model.destroy(q.conditions);
                    break;

                default:
                    throw new Error('Undefined Query Type');
            }
        } catch (err) {
            throw err;
        } finally {
            return result;
        }
    }

    /**
     * @async @function execTransaction
     * @description Process all queries using transaction. If any of the queries fails, the transaction is rolled back.
     *
     * @param {Array<Type.QueryObject>} queryObjArr Array of query object based on Type.QueryObject
     * @returns {boolean}
     * @throws {error}
     */
    async execTransaction(queryObjArr) {
        // begin transaction
        const t = await sequelize.transaction();

        try {
            for (let q of queryObjArr) {
                await this.execQuery(q, t);
            }

            await t.commit();
            return true;
        } catch (err) {
            await t.rollback();
            throw err;
        } finally {
            return false;
        }
    }
}

/* Export object as module */
module.exports = new Database();
