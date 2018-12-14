const sha512 = require('js-sha512');
const validator = require("email-validator");

module.exports = function (app) {
    return {

        account: function (req, res) {
            if (!req.session.user)
                res.redirect('/');
            else
                res.render('account', {user: req.session.user});
        },

        infosection: function (req, res) {
            res.render('infosection');
        },

        login: function (req, res) {
            let login_name = req.body.login;
            let pass = sha512(req.body.password);

            app.api.models.users.findOne({'login': login_name, password: pass}, function (err, user) {
                if (user) {
                        req.session.user = user;
                        req.session.save();
                        res.redirect('/account');
                }
                else
                    res.render('index', {errors: {login_name: 'credential invalide'}});
            })
        },

        logout: function (req, res) {
            req.session.destroy();
            res.redirect('/');
        },

        success: function (req, res) {
            if (typeof req.session.flash == "undefined")
                req.session.flash = {
                    title: '',
                    msg: '',
                };
        },

        displayRegisterForm: function (req, res) {
            res.render('register', {errors: {}})
        },

        register: function (req, res) {
            let login_name = req.body.login;
            let pass = req.body.password;
            let email = req.body.email;

            let errors = {};
            if (login_name.length < 3 || login_name.length > 20)
                errors.login_name = 'Pseudo entre 3 et 20 characteres';
            if (pass.length < 5 || pass.length > 20)
                errors.pass = 'Mot de passe entre 5 et 20 characteres';
            if (validator.validate(email) == false)
                errors.email = 'Veuillez rentrer une email valide';

            //console.log(errors)
            if (Object.keys(errors).length == 0) {
                app.api.models.users.findOne({$or: [{login: login_name}, {email: email}]}, function (err, doc) {
                    if (!doc) {
                        Compte = {
                            login: login_name,
                            email: email,
                            password: sha512(pass),
                            first_log_date: new Date(),
                        };
                        app.api.models.users.insert(Compte, function (err, docinsert) {
                            req.session.flash = {
                                title: 'Inscription réussie',
                                text: 'Vous ètes bien inscrit',
                            };
                            res.redirect('/success');
                        })
                    } else
                    {
                        console.log(doc);
                        res.end('credential deja pris');
                    }
                })
            } else {
                res.render('register', {errors: errors})
            }
        },

        getfirendlist:function (req,res) {
            res.redirect('/friendlist');
        }


    }
};