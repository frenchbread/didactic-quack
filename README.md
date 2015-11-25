# didactic-quack

Wrapper around [Telegram](https://telegram.org/) messenger API.

### Installation & setup

1. Download [Telegram app](https://telegram.org/apps) and set it up.

2. Text to [@BotFather](https://telegram.me/botfather) and follow instructions to create a new bot & get `api_token`.

    See Official docs for [Bot API](https://core.telegram.org/bots).

3. Install npm package.
    ```
    $ npm i didactic-quack --save
    ```

## Usage

#### In `app.js`:

```javascript
var CronJob = require('cron').CronJob; // node-cron package is not included. Run "npm i cron" to install it.
var DQ = require('didactic-quack');
       
var dq = new DQ({
    "parent": "your_telegram_id",
    "host": "https://api.telegram.org/bot",
    "token": "your_telegram_bot_api_token"
});
   
new CronJob('*/5 * * * * *', function() {

    dq.getUpdates();

}, null, true, 'America/Los_Angeles');

```

#### Run:

 ```
$ node app.js
```

#### Commands:

Text this commands directly to you newly created bot.

* `/time` - returns current time.

* `/log <project> | <hours> | <details>` - returns logged data.

`<project>` - `String`

`<hours>` - `Double`

`<details>` - `String`

## Changelog:

`v0.2.0` - Removed `Cron` & `Mongoose`. Code cleanup. Changed project structure.

## License

GNU AGPL
