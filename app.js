/**
 * server.js
 * Last modified: 2021.09.27
 * Author: Lee Hong Jun
 * Description: entryption.js can be used to encrypt user's password or auth code.. etc
 */

/*const utils = require('./utils/utils');
const mailer = require('./utils/mailer');

/*const utils = require('./utils/utils');
const r = Math.random();

const t1 = new Date().getTime();
for(let i = 0; i < 10000000; i++) {
    Math.random().toString().substr(2, 6);
}
const t2 = new Date().getTime() - t1;
console.log(`${t2 * 0.001} sec`);


const t3 = new Date().getTime();
for(let i = 0; i < 10000000; i++) {
    utils.createRandomCode(6);
}
const t4 = new Date().getTime() - t3;
console.log(`${t4 * 0.001} sec`);*/

/* Modules */
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const passport = require('passport');
const nunjucks = require('nunjucks');
const mailer = require('./utils/mailer');

dotenv.config();
const app = express();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

passportConfig();
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
nunjucks.configure('view', {
    express: app,
    watch: true,
});

nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('successfully connect to db');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'session-cookie',
    }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use((req, res, next) => {
    const error = new Error(`There is no router: ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.staus(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log('listening at ', app.get('port'));
    console.log('test');
});
