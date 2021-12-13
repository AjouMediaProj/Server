require('dotenv').config();

module.exports = {
    mailer: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: process.env.MAILER_ID,
            pass: process.env.MAILER_PW,
        },
    },
    sequelize: {
        development: {
            username: 'root',
            password: process.env.SEQUELIZE_PASSWORD,
            database: 'votedb_development',
            host: '127.0.0.1',
            dialect: 'mysql',
            dialectOptions: {
                multipleStatements: true,
            },
        },
        test: {
            username: 'root',
            password: process.env.SEQUELIZE_PASSWORD,
            database: 'votedb_test',
            host: '127.0.0.1',
            dialect: 'mysql',
            dialectOptions: {
                multipleStatements: true,
            },
        },
        production: {
            username: 'root',
            password: process.env.SEQUELIZE_PASSWORD,
            database: 'votedb',
            host: '127.0.0.1',
            dialect: 'mysql',
            dialectOptions: {
                multipleStatements: true,
            },
            logging: false, // To hide query commands in a production environment.
        },
    },
};
