const DQ = require('./');
const config = require('./config/conf');
const logger = require('intel');

const dq = new DQ({
    token: config.token,
    parent: config.parent
});

// setInterval(() => {
//
//     dq.getUpdates((err) => {
//       if (err) console.log(err);
//     });
//
// }, 3000);
//
// dq.on('message', (details) => {
//   console.log(details.text + " new messages");
// })

dq.on('message', (message) => {

  dq.send({ to: message.to, text: message.module });
})


dq.listen((err) => {
  if (err) logger.error(err);
});
