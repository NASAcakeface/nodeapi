'use strict';
var azure = require('azure');
var fs = require('fs');

function defineRoutes(server) {
    server.post('/upload/:userid', function (req, res, next) {
        var accessKey = 'uGKV7EplzvL7hMkyk7InsBqiHDgeRH7DcyCJb/ZQAqbPm7bpzRTJ05WKYX7dzmiT0VCt2s6MgmgZYux/oq0oQQ==';
        var storageAccount = 'nasahack';
        var container = 'images';    
        var blobService = azure.createBlobService(storageAccount, accessKey);
        if(!req.files){
            res.send(404, "photo required");
            return next()
        }
        var photo =  req.files.photo;
        var filename = req.params.userid + "_" + Date.now() + "_" + photo.name;
        
        var stream = fs.createReadStream(photo.path);

        blobService.createBlockBlobFromStream(container, filename, stream, photo.size, function (error) {
            stream.close()
            if (error) {
                res.send(400, error);
            } else {
                res.send(201);
            }
        });       
    });
}

module.exports = defineRoutes;
