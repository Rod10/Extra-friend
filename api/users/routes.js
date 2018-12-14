module.exports = function(app)
{
    let ctrl = app.api.controllers.users;

    app.instance.get('/account', ctrl.account);
    app.instance.post('/login', ctrl.login);
    app.instance.get('/logout', ctrl.logout);
    app.instance.post('/register', ctrl.register);
    app.instance.get('/success', ctrl.success);
    app.instance.get('/register', ctrl.displayRegisterForm);
    app.instance.get('/infosection', ctrl.infosection);
    app.instance.get('/friendlist', ctrl.getfirendlist)
};
