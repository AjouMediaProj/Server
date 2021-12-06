/**
 * user.js
 * Last modified: 2021.11.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Sequelize model (User)
 */

/* Modules */
const Sequelize = require('sequelize');
const BaseModel = require('@src/database/models/baseModel');
const type = require('@src/utils/type');

/**
 * @class User
 * @extends BaseModel
 * @description User model class
 */
class User extends BaseModel {
    /**
     * @static @function init
     * @description Initialize the User Model
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
            idx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            studentID: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
            },
            major: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            accessLevel: {
                type: Sequelize.INTEGER,
                defaultValue: 0, // 0: normal user, 1: administrator, -1: inactive account
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
     * @description Make new data object based on type.UserObject
     *
     * @param {type.UserObject} initData Data to initialize the object
     * @returns {type.UserObject} New empty object based on type.UserObject
     */
    static makeObject(initData = null) {
        return super.makeObject(initData);
    }
}

/* Export class as module */
module.exports = User;
