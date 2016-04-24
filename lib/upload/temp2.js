var watson = require('watson-developer-cloud');
var fs = require('fs');

var speech_to_text = watson.speech_to_text({
  username: 'f924e626-93ce-4cd8-a533-ebf949a8b0d7',
  password: 'aXmmi4YXFfFv',
  version: 'v1',
});

// @TODO read stream magic
request('https://nasahack.blob.core.windows.net/audio/1_1461452561467_amy.wav').pipe(fs.createWriteStream('words.wav'))

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
});