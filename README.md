# didactic-quack

Wrapper around [Telegram](https://telegram.org/) messenger API.

![NPM Stats](https://nodei.co/npm/didactic-quack.png?downloads=true&downloadRank=true&stars=true)

### Installation & setup

1. Download [Telegram app](https://telegram.org/apps) and set it up.

2. Text to [@BotFather](https://telegram.me/botfather) and follow instructions to create a new bot & get `api_token`.

    See Official docs for [Bot API](https://core.telegram.org/bots).

3. Install npm package.
    ```
    $ npm i didactic-quack --save
    ```

## Usage

You might want to install [`node-cron`](https://github.com/ncb000gt/node-cron) package to check for new messages, for example every 5 seconds.

#### In `app.js`:

```javascript
var DQ = require('didactic-quack');
       
var dq = new DQ({
    "token": "your_telegram_bot_api_token"
});

setInterval(function () {

    dq.getUpdates(function (err, res) {
        console.log(res);
    });

}, 3000);

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

`v0.2.2` - Fixed path to `offset.txt`.

`v0.2.0` - Removed `Cron` & `Mongoose`. Code cleanup. Changed project structure.

## License

[MIT license](https://github.com/frenchbread/didactic-quack/blob/master/LICENSE.md).
