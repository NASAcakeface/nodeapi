var _ = require('lodash');
var azure = require('azure');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var request = require('request');

var uploadFile = function uploadImage(req, res, next) {
  var accessKey = 'uGKV7EplzvL7hMkyk7InsBqiHDgeRH7DcyCJb/ZQAqbPm7bpzRTJ05WKYX7dzmiT0VCt2s6MgmgZYux/oq0oQQ==';
  var storageAccount = 'nasahack';

  if(['image', 'speech'].indexOf(req.params.input_type) == -1){
    res.send(404, "please upload images or audio");
    return next();
  }
  var container = req.params.input_type;    
  var blobService = azure.createBlobService(storageAccount, accessKey);
  if(!req.files){
    res.send(404, "item required");
    return next();
  }
  var item =  req.files.item;
  var user_id = req.params.userid;
  var now = new Date();
  var dateFormat = require('dateformat');
  var timestamp = dateFormat(now, "yyyy-mm-dd, hh:MM:ss");
  var filename = user_id + "_" + timestamp + "_" + item.name;
  
  var stream = fs.createReadStream(item.path);

  blobService.createBlockBlobFromStream(container, filename, stream, item.size, function (error) {
    stream.close();
    if (error) {
        res.send(400, error);
    } else {
      var url = "https://nasahack.blob.core.windows.net/" + container + "/" + filename;
      if(container == 'images'){
        sendRequest(url, user_id, timestamp, container, null, function(err){
          if(err){
            res.send(500,"Could not call /emotions");
          } else {
            res.send(201);
          }
          return next();
        });
      } else {
        speechToText(url, filename, function(err, text){
          if(err){
            res.send(400, err);
          } else {
            sendAnalyzeRequest(text, function(error, response){
              if(error){
                res.send(500, "could not analyze text");
              } else {
                var categories = response.document_tone.tone_categories;

                var emotional = _.filter(categories, {"category_id": "emotion_tone"});
                var data = emotional[0].tones

                sendRequest(url, user_id, timestamp, container, data, function(err){
                  if(err) {
                    res.send(500, "could not post audio to /emotion")
                  } else {
                    res.send(201);    
                  }
                });
              }
            });
          }
        });
      }
    }
  });
};

var speechToText = function speechToText(url, filename, callback){
  var speech_to_text = watson.speech_to_text({
    username: 'f924e626-93ce-4cd8-a533-ebf949a8b0d7',
    password: 'aXmmi4YXFfFv',
    version: 'v1',
  });
  var streamWav = fs.createWriteStream(filename);
  request(url).pipe(streamWav);
  streamWav.on('finish', function(){
    var params = {
      audio: fs.createReadStream(filename),
      content_type: 'audio/wav',
      timestamps: true,
      word_alternatives: 0.9
    };

    speech_to_text.recognize(params, function(err, transcript) {
      fs.unlink(filename);
      if (err){
        callback("Watson Error: could not translate to text: " + err.error);
      } else{
        //@TODO is this the proper text?
        callback(null,transcript.results[0].alternatives[0].transcript);
      }
    });
  });
};

// query speech to text then send text to mah DUDE brandon
var sendAnalyzeRequest = function sendRequest(text, callback){
  var tone_analyzer = watson.tone_analyzer({
    username: '1d00a14a-98d4-4c4a-8258-f1354feac6cc',
    password: 'KP6pFDLcWmMD',
    version: 'v3-beta',
    version_date: '2016-02-11'
  });    

  tone_analyzer.tone({text: text}, function(err, tone) {
    if (err) callback("cannot analyze text")
    else callback(null, tone);
  });
};

var sendRequest = function sendRequest(url, user_id, time, type, data, callback){
  var request = require('request');
  
  var options = {
    uri: 'http://nasadataapi.azurewebsites.net/emotions/',
    method: 'POST',
    json: {
      "url": url,
      "user_name": user_id,
      "time_stamp": time,
      "type": type,
      "data": data
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback();
    } else {
      callback("Could not post to /emotions");
    }
  });
};

module.exports = {
  uploadFile: uploadFile
};
