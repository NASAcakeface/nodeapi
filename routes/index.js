'use strict';
var azure = require('azure');
var fs = require('fs');

function defineRoutes(server) {
    server.post('/upload', function (req, res) {
        var accessKey = 'uGKV7EplzvL7hMkyk7InsBqiHDgeRH7DcyCJb/ZQAqbPm7bpzRTJ05WKYX7dzmiT0VCt2s6MgmgZYux/oq0oQQ==';
        var storageAccount = 'nasahack';
        var container = 'images';    
        var blobService = azure.createBlobService(storageAccount, accessKey);
        var photo =  req.files.photo;
        // @TODO add timestamp
        var stream = fs.createReadStream(photo.path);
        blobService.createBlockBlobFromStream(container, photo.name, stream, photo.size, function (error) {
            if (error) {
                res.send(400, error)
            } else {
                res.send(201);
            }
        });       
    });
}

module.exports = defineRoutes;
