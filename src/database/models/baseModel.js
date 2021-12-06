/**
 * baseModel.js
 * Last modified: 2021.11.29
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: base model for another specific models
 */

/* Modules */
const Sequelize = require('sequelize');
const type = require('@src/utils/type');
const utility = require('@src/utils/utility');

/**
 * @class BaseModel
 * @extends Sequelize.Model
 * @description Base model class extends the Sequelize's Model
 */
class BaseModel extends Sequelize.Model {
    /**
     * @static @function makeQuery
     * @description Make base query object.
     *
     * @param {number} method Query method defined in BaseModel method
     * @param {object} conditions Query condition object
     * @param {object} data Query data object
     * @returns {type.QueryObject} New query object.
     */
    static makeQuery(method = 0, data = null, conditions = {}) {
        const q = utility.clone(type.QueryObject);
        q.model = this.name;
        q.method = method;
        q.data = data;
        q.conditions = conditions;

        return q;
    }

    /**
     * @override
     * @static @function create
     * @description Override the Sequelize.Model.create method.
     *
     * @param {object} data Input data
     * @param {Sequelize.Transaction} t Instance of Sequelize.Transaction ( t = sequelize.transaction() )
     * @returns {object}
     */
    static async create(data, t) {
        let result = null;

        try {
            if (t) result = await super.create(data, { transaction: t });
            else result = await super.create(data);

            if (result) result = result.dataValues;
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @override
     * @static @function findOne
     * @description Override the Sequelize.Model.findOne method.
     *
     * @param {object} conditions Query conditions. ex) { where: { id: 'abcd' }}
     * @param {Sequelize.Transaction} t Instance of Sequelize.Transaction ( t = sequelize.transaction() )
     * @returns {object}
     */
    static async findOne(conditions, t) {
        let result = null;
        conditions.raw = true;
        if (t) conditions.transaction = t;

        try {
            result = await super.findOne(conditions);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @override
     * @static @function findAll
     * @description Override the Sequelize.Model.findAll method.
     *
     * @param {object} conditions Query conditions. ex) { where: { id: 'abcd' }}
     * @param {Sequelize.Transaction} t Instance of Sequelize.Transaction ( t = sequelize.transaction() )
     * @returns {Array<object>}
     */
    static async findAll(conditions, t) {
        let result = null;
        conditions.raw = true;
        if (t) conditions.transaction = t;

        try {
            result = await super.findAll(conditions);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @override
     * @static @function update
     * @description Override the Sequelize.Model.update method.
     *
     * @param {object} data Input data
     * @param {object} conditions Query conditions ex) { where: { id: 'abcd' }}
     * @param {Sequelize.Transaction} t Instance of Sequelize.Transaction ( t = sequelize.transaction() )
     * @returns {number} The number of modified rows
     */
    static async update(data, conditions, t) {
        let result = null;
        if (t) conditions.transaction = t;

        try {
            result = await super.update(data, conditions);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    /**
     * @override
     * @static @function delete
     * @description Override the Sequelize.Model.destroy method.
     *
     * @param {object} conditions Query conditions ex) { where: { id: 'abcd' }}
     * @param {Sequelize.Transaction} t Instance of Sequelize.Transaction ( t = sequelize.transaction() )
     * @returns {number} The number of deleted rows
     */
    static async delete(conditions, t) {
        let result = null;
        if (t) conditions.transaction = t;

        try {
            result = await super.destroy(conditions);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

/* Export class as module */
module.exports = BaseModel;
