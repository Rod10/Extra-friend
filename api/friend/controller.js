const sha512 = require('js-sha512');
const validator = require("email-validator");

module.exports = function (app) {
    return {

        getfirendlist: function (req, res) {
            res.redirect('/loadfriend');
        },
        loadfriend: function (req, res) {
            app.api.models.friend.find({name: req.session.user.login}, {
                name: 1,
                friend_name: 1,
                request: 1
            }, function (error, docs) {
                if (docs == '') {
                    Friend = {
                        name: req.session.user.login,
                        friend_name: [],
                        request: [],
                    };
                    app.api.models.friend.insert(Friend, function (err, docinsert) {
                        res.render('friendlist', {docs: docs})
                    })
                } else {
                    res.render('friendlist', {docs: docs})
                }
            });
        },

        addfriend: function (req, res) {
            res.render('addfriends', {errors: {}});
        },

        addfriends: function (req, res) {
            let names = req.body.nom;
            let errors = {};
            if (Object.keys(errors).length == 0) {
                app.api.models.friend.find({name: names}, {
                    name: 1,
                    friend_name: 1,
                    request: 1,
                    _id: 1
                }, function (err, docs) {
                    console.log(docs);
                    if (docs=='')
                    {
                        docs={name:names};
                        res.render('createfriendaccount', {docs:docs, errors:{}})
                    }
                    else if (docs) {
                        if (!docs.request) {
                            for (doc of docs) {
                                let name = [req.session.user.login];
                                let test = doc.request;
                                let newrequest = name.concat(test);
                                app.api.models.friend.update({name: names}, {$set: {request: newrequest}}, {}, function (err, numReplaced) {
                                    res.redirect('/loadfriend');
                                });
                            }
                        }
                    }
                })
            }
        },

        acceptfriend: function (req, res) {
            app.api.models.friend.find({name: req.body.name}, {friend_name: 1}, function (err, docs) {
                if (!docs.friend_name) {
                    for (doc of docs) {
                        let name = [req.session.user.login];
                        let test = doc.friend_name;
                        let friend = name.concat(test);
                        app.api.models.friend.update({name: req.body.name}, {$set: {friend_name: friend}}, {}, function (err, numReplaced) {
                            app.api.models.friend.find({name: req.session.user.login}, {
                                friend_name: 1,
                                request: 1
                            }, function (err, docs) {
                                for (doca of docs) {
                                    let name = [req.body.name];
                                    let test = doca.friend_name;
                                    let friend = name.concat(test);
                                    let rmfriend = doca.request;
                                    for (let i = rmfriend.length - 1; i >= 0; i--) {
                                        if (rmfriend[i] === req.body.name) {
                                            rmfriend.splice(i, 1);
                                        }
                                    }
                                    app.api.models.friend.update({name: req.session.user.login}, {
                                        $set: {
                                            friend_name: friend,
                                            request: rmfriend
                                        }
                                    }, {}, function (err, numReplaced) {
                                        res.redirect('/loadfriend');
                                    });
                                }
                            });
                        });
                    }
                }

            })
        },

        addfriendaccount: function (req,res)
        {
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
                            Friend = {
                                name: login_name,
                                friend_name: [],
                                request: [req.session.user.login],
                            };
                            app.api.models.friend.insert(Friend, function (err, docinsert) {
                                res.redirect('/loadfriend');
                            })
                        })
                    } else {
                        console.log(doc);
                        res.end('credential deja pris');
                    }
                })
            } else {
                res.render('register', {errors: errors})
            }
        },

    }
};