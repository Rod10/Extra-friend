var express = require('express');
var path = require('path'); 
var bodyParser = require('body-parser');
var crypto = require('crypto');
var app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = class mainpagescript{

    static showerror(req,res)
    {
        res.set({
            'Access-Control-Allow-Origin' : '*'
        });
        res.redirect('/src/html/index.html')
        JSDOM.fromURL("http://127.0.0.1:3000/src/html/index.html").then(dom => {
            //console.log(dom.serialize());
            var wronglog = dom.window.document.getElementById('wronglog')
            wronglog.style.display = 'block';
        });
    }
}