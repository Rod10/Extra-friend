const express = require('express');
const glob = require('glob');
const path = require('path');
const Datastore = require('nedb');
const utils = require('./utils');
const fs = require('fs');

module.exports = class Router
{
    constructor(app) {
        this.app = app;
        this.app.api = {
            controllers: {},
            routes: {},
            models: {}
        };

        this.loadModels();
        this.loadViews();
        this.loadControllers();
        this.loadRoutes();
    }

    loadViews() {
        let root = path.join(__dirname, '../api');
        let views = [];

        fs.readdirSync(root).forEach(file => {
            views.push(path.join(path.join(root, file), 'views'));
        });

        this.app.instance.set('views', views);
    }

    loadModels() {
        glob(path.join(__dirname, '../api') + '/**/model.js', {}, (err, files) => {
            files.forEach(file => {
                let parts = file.split('/');
                let name = parts[parts.length - 2];

                this.app.api.models[name] = new Datastore({
                    filename: 'bdd/'+name+'.db',
                    autoload: true
                });
            })
        });
    }

    loadControllers() {
        glob(path.join(__dirname, '../api') + '/**/controller.js', {}, (err, files) => {
            files.forEach(file => {
               let controller = require(file)(this.app);
               let parts = file.split('/');
               let name = parts[parts.length - 2];
               this.app.api.controllers[name] = controller;
            })
        });
    }

    loadRoutes() {
        glob(path.join(__dirname, '../api') + '/**/routes.js', {}, (err, files) => {
            files.forEach(file => {
                let routes = require(file)(this.app);
            })
        });
    }
};