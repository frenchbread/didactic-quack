const DQ = require('./');
const config = require('./config/conf');

const dq = new DQ({
    token: config.token,
    parent: config.parent
});

setInterval(() => {

    dq.getUpdates((err) => {
      if (err) console.log(err);
    });

}, 3000);
