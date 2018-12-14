module.exports = function (app) {
    return {
        loadinfos: function (req, res) {
            app.api.models.infos.find({name: req.session.user.login}, {
                age: 1,
                famille: 1,
                race: 1,
                nourriture: 1,
                _id: 1
            }, function (error, docs) {
                console.log(docs);
                if (!docs) {
                    res.redirect('/addinfos', {errors: {}});
                } else {
                    console.log(docs);
                    res.render('infosection', {docs: docs});
                }
            });
        },

        addinfos: function (req, res) {
            app.api.models.infos.find({name: req.session.user.login}, {
                age: 1,
                famille: 1,
                race: 1,
                nourriture: 1,
                _id: 1
            }, function (error, docs) {
                if (docs=='')
                {
                    doc = [{
                        age: '',
                        famille: '',
                        race: '',
                        nourriture: ''
                    }];

                    res.render('addinfos', {errors: {}, docs: doc});
                }
                else
                    res.render('addinfos', {errors: {}, docs: docs});
            });
        },

        registerinfos: function (req, res) {

            let errors = {};
            let age = req.body.age;
            let famille = req.body.famille;
            let race = req.body.race;
            let nourriture = req.body.nourriture;

            if (Object.keys(errors).length == 0) {
                app.api.models.infos.findOne({name: req.session.user.login}, function (err, docs) {
                    if (!docs) {
                        Infos = {
                            name: req.session.user.login
                            , age: age
                            , famille: famille
                            , race: race
                            , nourriture: nourriture
                        };
                        app.api.models.infos.insert(Infos, function (err, docinsert) {
                            res.redirect('/infosection');
                        })
                    } else {
                        app.api.models.infos.update({name: req.session.user.login}, {$set: {age: age, famille: famille, race: race, nourriture: nourriture}}, {}, function (err, numReplaced) {
                            res.redirect('/infosection');
                        });
                    }
                });
            }
        }

    }
};