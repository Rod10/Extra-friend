module.exports = function(app)
{
    let ctrl = app.api.controllers.app;
    app.instance.get('/', ctrl.index);
};
