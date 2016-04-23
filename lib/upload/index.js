var _ = require('lodash');
var azure = require('azure');
var fs = require('fs');

var uploadFile = function uploadImage(req, res, next) {
    var accessKey = 'uGKV7EplzvL7hMkyk7InsBqiHDgeRH7DcyCJb/ZQAqbPm7bpzRTJ05WKYX7dzmiT0VCt2s6MgmgZYux/oq0oQQ==';
    var storageAccount = 'nasahack';

    if(['images', 'audio'].indexOf(req.params.input_type) == -1){
        res.send(404, "please upload images or audio")
        return next();
    }
    var container = req.params.input_type;    
    var blobService = azure.createBlobService(storageAccount, accessKey);
    if(!req.files){
        res.send(404, "item required");
        return next();
    }
    var item =  req.files.item;
    var filename = req.params.userid + "_" + Date.now() + "_" + item.name;
    
    var stream = fs.createReadStream(item.path);

    blobService.createBlockBlobFromStream(container, filename, stream, item.size, function (error) {
        stream.close();
        if (error) {
            res.send(400, error);
        } else {
            res.send(201);
        }
    });       
};

module.exports = {
    uploadFile: uploadFile
}