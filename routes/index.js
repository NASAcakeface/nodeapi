'use strict';
var upload = require('../lib/upload');
var analyze = require('../lib/upload/analyze')

function defineRoutes(server) {
	server.post('/analyze', analyze.analyzeText)
    server.post('/upload/:input_type/:userid', upload.uploadFile);
}

module.exports = defineRoutes;
