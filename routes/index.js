'use strict';
var upload = require('../lib/upload');

function defineRoutes(server) {
    server.post('/upload/:userid', upload.uploadImage);
}

module.exports = defineRoutes;
