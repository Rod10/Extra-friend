module.exports = function (app) {
    let ctrl = app.api.controllers.friend;

    app.instance.get('/friendlist', ctrl.getfirendlist);
    app.instance.get('/loadfriend', ctrl.loadfriend);
    app.instance.get('/addfriend', ctrl.addfriend);
    app.instance.post('/add', ctrl.addfriends);
    app.instance.post('/acceptfriend', ctrl.acceptfriend);
};