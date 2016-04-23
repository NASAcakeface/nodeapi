'use strict';
var upload = require('../lib/upload');

function defineRoutes(server) {
    server.post('/upload/:input_type/:userid', upload.uploadImage);
}

module.exports = defineRoutes;
