var _ = require('lodash');
var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: '1d00a14a-98d4-4c4a-8258-f1354feac6cc',
  password: 'KP6pFDLcWmMD',
  version: 'v3-beta',
  version_date: '2016-02-11'
});


var analyzeText = function analyzeText(req, res, next) {
    console.log('haus')
    var text = JSON.parse(req.body)
    tone_analyzer.tone({text: text.text},
    function(err, tone) {
        if (err)
            console.log(err);
        else
            res.send(tone, null, 2)
    });
       
};

module.exports = {
    analyzeText: analyzeText
}