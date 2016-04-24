var watson = require('watson-developer-cloud');
var fs = require('fs');
var request = require('request')

var speech_to_text = watson.speech_to_text({
  username: 'f924e626-93ce-4cd8-a533-ebf949a8b0d7',
  password: 'aXmmi4YXFfFv',
  version: 'v1',
  url: "https://stream.watsonplatform.net/speech-to-text/api",
  inactivity_timeout: 1
});

var params = {
  content_type: 'audio/wav',
  continuous: true,
  interim_results: true
};

// Create the stream.
var recognizeStream = speech_to_text.createRecognizeStream(params);

request('https://nasahack.blob.core.windows.net/audio/1_1461452561467_amy.wav').pipe(fs.createWriteStream('words.wav'))

fs.createReadStream('/Users/alex/Repos/nasa/nodeapi/words.wav').pipe(recognizeStream);

// Pipe out the transcription.
recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

// Get strings instead of buffers from `data` events.
recognizeStream.setEncoding('utf8');

// Listen for 'data' events for only the final results.
// Listen for 'results' events to get interim results.
recognizeStream.on("error", console.log)
recognizeStream.on("data", console.log)

// ['data', 'results', 'error', 'connection-close'].forEach(function(eventName)
//   {
//     console.log("FACE")
//     recognizeStream.on(eventName,console.log.bind(console, eventName + ' event: '));
//   }
// );


