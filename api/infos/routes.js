module.exports = function(app)
{
    let ctrl = app.api.controllers.infos;

    app.instance.get('/infosection', ctrl.loadinfos);
    app.instance.get('/addinfos', ctrl.addinfos);
    app.instance.post('/registerinfos', ctrl.registerinfos);
};
