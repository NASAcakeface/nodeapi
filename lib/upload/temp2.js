var watson = require('watson-developer-cloud');
var fs = require('fs');

var speech_to_text = watson.speech_to_text({
  username: 'f924e626-93ce-4cd8-a533-ebf949a8b0d7',
  password: 'aXmmi4YXFfFv',
  version: 'v1',
  //url: "https://stream.watsonplatform.net/speech-to-text/api"
});


var params = {
  audio: fs.createReadStream('/Users/alex/Repos/nasa/nodeapi/words.wav'),
  content_type: 'audio/wav',
  timestamps: true,
  word_alternatives: 0.9
};

speech_to_text.recognize(params, function(err, transcript) {
  if (err)
    console.log(err);
  else
    console.log(transcript.results[0].alternatives[0].transcript)
    // console.log(JSON.stringify(transcript, null, 2));
});