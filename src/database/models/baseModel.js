/**
 * baseModel.js
 * Last modified: 2021.11.24
 * Author: Lee Hong Jun (arcane22, hong3883@naver.com)
 * Description: base model for another specific models
 */

/* Modules */
const Sequelize = require('sequelize');
const Type = require('@src/utils/type');
const utility = require('@src/utils/utility');

/**
 * @class BaseModel
 * @extends Sequelize.Model
 * @description Base model class extends the Sequelize's Model
 */
class BaseModel extends Sequelize.Model {
    /**
     * @static @function makeObject
     * @description Make new object.
     *
     * @param {object} initData Data to initialize the object.
     * @returns {object} New empty object based on model.
     */
    static makeObject(initData = null) {
        const obj = Type.makeObject(this.name);
        utility.merge(initData, obj);
        return obj;
    }

    /**
     * @static @function makeQuery
     * @description Make base query object.
     *
     * @param {number} type Query type (Type.queryType)
     * @param {object} conditions Query condition object.
     * @param {object} data Query data.
     * @returns {Type.QueryObject} New empty query object.
     */
    static makeQuery(type = 0, conditions = {}, data = {}) {
        const obj = Type.makeObject('Query');
        obj.modelName = this.name;
        obj.type = type;
        obj.conditions = conditions;
        obj.data = data;

        return obj;
    }
}

/* Export class as module */
module.exports = BaseModel;
