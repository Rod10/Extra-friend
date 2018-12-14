const events = require('events');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('../config/app.json');
const Mailer = require('./mailer');
const Router = require('./router');
const emailConfig = require('../config/mails.json');

module.exports = class Application
{
    constructor() {
        this.bus = new events.EventEmitter();
        this.instance = express();
        this.setup();
        this.mailer = new Mailer(this, emailConfig);
        this.router = new Router(this);
    }

    setup() {
        this.bus.on('mail', data => {
            this.mailer.instance.messages().send(data, (error, body) => {
                console.log(body);
            });
        });

        //this.instance.set('trust proxy', 1)
        this.instance.use(session({
            secret: 'firebug',
            resave: true,
            saveUninitialized: false,
            cookie: {
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            },
            store: new session.MemoryStore()
        }));


        this.instance.use(bodyParser.json());
        this.instance.use(bodyParser.urlencoded({extended: true}));
        this.instance.set('view engine', 'ejs');
        this.instance.set('views', path.join(__dirname, 'src/html'));

        this.instance.use(function (req,res,next) {
            res.locals.user = typeof req.session.user != 'undefined' ? req.session.user : null;
            next();
        });
        this.instance.use('/asset', express.static('asset'));
        this.instance.use(express.static('src'));
    }

    start() {
        this.instance.listen(config.local.port, () => {
            console.log('Server listening on port:', config.local.port);
        });
    }
};