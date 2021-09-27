const Sequelize = require('sequelize');

/**
const models = {
    uid: {
        type: Sequelize.STRING(64),
        allowNull: true,
        unique: true
    },
    email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true
    },
    nickname: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: 'user0000'
    },
    password: {
        type: Sequelize.STRING(64),
        allowNull: true
    },
    salt: {
        type: Sequelize.STRING(64),
        allowNull: true
    }
}

const ops = {
    sequelize,
    timestamps: true,
    underscored: false,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
}
*/

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true
            },
            nickname: {
                type: Sequelize.STRING(15),
                allowNull: false,
                defaultValue: 'user0000'
            },
            password: {
                type: Sequelize.STRING(64),
                allowNull: true
            },
            salt: {
                type: Sequelize.STRING(64),
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }

    static associate(db) {}
}

module.exports = User;

