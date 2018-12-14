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
                    if (docs) {
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

    }
};