/**
 * database.js
 * Last modified: 2021.10.16
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Database system based on sequelize.
 */

/* Modules */
require('dotenv').config();
const Sequelize = require('sequelize');
const logger = require('@src/utils/logger');

/* Models */
const Account = require('@src/database/models/account');
const User = require('@src/database/models/user');
const Candidate = require('@src/database/models/candidate');
const Vote = require('@src/database/models/vote');

/* Constants */
const nodeEnv = process.env.NODE_ENV || 'development';
const dbConfig = require('@root/config/config').sequelize[nodeEnv];

/**
 * @class Database
 * @description
 */
class Database {
    /**
     * @function constructor
     * @description Constructor of Database class (Initialize the 'models' object)
     */
    constructor() {
        this.models = {
            sequelize: new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig),
            account: Account,
            user: User,
            candidate: Candidate,
            vote: Vote,
        };
    }

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
            this.models.account.init(this.models.sequelize);
            this.models.user.init(this.models.sequelize);
            this.models.candidate.init(this.models.sequelize);
            this.models.vote.init(this.models.sequelize);

            // Associate the models
            this.models.account.associate(this.models);
            this.models.user.associate(this.models);
            this.models.candidate.associate(this.models);
            this.models.vote.associate(this.models);

            await this.models.sequelize.sync({ force, logging });
            logger.info('Initialize the database (sequelize).');
        } catch (err) {
            logger.error(err);
        }
    }
}

/* Export object as module */
module.exports = new Database();
