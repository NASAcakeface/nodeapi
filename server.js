 'use strict';

var port = process.env.PORT || 8000;
var restify = require('restify');
var routes = require('./routes');


function setup(server) {
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(restify.CORS());

    routes(server);
}

function start(server) {
    server.listen(port);
}

function init(server) {
    if (!server) {
        server = restify.createServer();
    }

    setup(server);
    start(server);
}

init();
