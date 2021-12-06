/**
 * authMail.js
 * Last modified: 2021.11.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Sequelize model (AuthMail)
 */

/* Modules */
const Sequelize = require('sequelize');
const BaseModel = require('@src/database/models/baseModel');
const type = require('@src/utils/type');

/**
 * @class AuthMail
 * @extends BaseModel
 * @description Auth Mail model class
 */
class AuthMail extends BaseModel {
    /**
     * @static @function init
     * @description Initialize the Account Model
     *
     * @param {object} sequelize Instance of Sequelize.
     * @returns {Sequelize.Model}
     */
    static init(sequelize) {
        // modelName (sequelize model name), tableName (mysql table name)
        const mName = this.name;
        const tName = mName.toLowerCase() + 's';

        // Attributes of Account model
        const attributes = {
            email: {
                type: Sequelize.STRING(48),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            authCode: {
                type: Sequelize.STRING(6),
                allowNull: false,
            },
            expirationDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        };

        // Options of Account model
        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: mName,
            tableName: tName,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        };

        return super.init(attributes, opts);
    }

    /**
     * @override
     * @static @function makeObject
     * @description Make new data object based on type.AuthMailObject
     *
     * @param {type.AuthMailObject} initData Data to initialize the object
     * @returns {type.AuthMailObject} New empty object based on type.AuthMailObject
     */
    static makeObject(initData = null) {
        return super.makeObject(initData);
    }
}

/* Export class as module */
module.exports = AuthMail;
