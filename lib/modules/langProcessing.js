const watson = require('watson-developer-cloud');
const config = require('../../config/conf');
const fs = require('fs');

// const dialog = watson.dialog(config.credentials);
//
// dialog.getDialogs({}, (err, dialogs) => {
//   if (err) console.log(err);
//   console.log(dialogs)
// });
//
// dialog.conversation({
//   // conversation_id: 'conversation_1',
//   // client_id: 'client_1',
//   input: 'hello',
//   dialog_id: 'en-us'
// }, function (err, res) {
//   if (err)
//     console.log('error:', err);
//   else
//     console.dir(res);
// });

const visual_recognition = watson.visual_recognition({
  username: config.credentials.username,
  password: config.credentials.password,
  version_date: '2015-12-02',
  version: 'v2-beta',
});

var params = {
	images_file: fs.createReadStream(__dirname+'/pic2.jpg')
	// classifier_ids: fs.readFileSync('./classifierlist.json')
};

visual_recognition.classify(params,
	function(err, response) {
   	 if (err)
      		console.log(err);
    	 else
   		console.log(JSON.stringify(response, null, 2));
});
