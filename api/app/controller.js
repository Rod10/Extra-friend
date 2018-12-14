module.exports = function(app) {
    return {
        index: function(req, res) {
            app.api.models.app.find({}, function(err, doc) {
                res.render('index', {
                    errors: {},
                    user: req.session.user
                });
            });
        },
        truc: function(req, res) {

        }
    }
};