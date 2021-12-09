/**
 * candidate.js
 * Last modified: 2021.11.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: Candidate model
 */

/* Modules */
const Sequelize = require('sequelize');
const BaseModel = require('@src/database/models/baseModel');
const type = require('@src/utils/type');
/**
 * @class Candidate
 * @description Candidate database model
 */
class Candidate extends BaseModel {
    /**
     * @static @function init
     * @description Initialize the Candidate model
     *
     * @param {object} sequelize Instance of Sequelize.
     * @returns {Sequelize.Model}
     */
    static init(sequelize) {
        // modelName (sequelize model name), tableName (mysql table name)
        const mName = this.name;
        const tName = mName.toLowerCase() + 's';

        // Attributes of Candidate model
        const attributes = {
            idx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            voteIdx: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
                unique: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
                unique: false,
            },
            photo: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
                unique: false,
            },
            img: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
                unique: false,
            },
            txt: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: '',
                unique: false,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
                unique: false,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
                unique: false,
            },
        };

        // Options of Candidate model
        const opts = {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: mName,
            tableName: tName,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        };

        return super.init(attributes, opts);
    }

    /**
     * @override
     * @static @function makeObject
     * @description Make new data object based on type.CandidateObject
     *
     * @param {type.CandidateObject} initData Data to initialize the object
     * @returns {type.CandidateObject} New empty object based on type.CandidateObject
     */
    static makeObject(initData = null) {
        return super.makeObject(initData);
    }
}

/* Exports */
module.exports = Candidate;
