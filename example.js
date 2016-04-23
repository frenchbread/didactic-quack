const DQ = require('./');
const config = require('./config/conf');
const logger = require('intel');

const dq = new DQ({
    token: config.token,
    parent: config.parent
});

dq.on('message', (message) => {

  const to = message.to;
  const text = message.text;
  const moduleResponse = dq.initModule(text);

  dq.send({ to, text: moduleResponse });
})


dq.listen((err) => {
  if (err) logger.error(err);
});
