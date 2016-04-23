var _ = require('lodash');
var azure = require('azure');
var watson = require('watson-developer-cloud');
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
    var timestamp = Date.now();
    var filename = req.params.userid + "_" + timestamp + "_" + item.name;
    
    var stream = fs.createReadStream(item.path);

    blobService.createBlockBlobFromStream(container, filename, stream, item.size, function (error) {
        stream.close();
        if (error) {
            res.send(400, error);
        } else {
            var url = "https://nasahack.blob.core.windows.net/images/" + filename;
            var request = require('request');

            var options = {
              uri: 'http://nasadataapi.azurewebsites.net/emotions/',
              method: 'POST',
              json: {
                "url": url,
                "user_id": req.params.userid,
                "timestamp": timestamp
              }
            };
            request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                res.send(201);
              } else {
                res.send(500, "Could not post to /emotions")
              }
              
            });
            
        }
    });       
};

module.exports = {
    uploadFile: uploadFile
}