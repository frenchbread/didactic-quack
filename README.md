# didactic-quack

Wrapper around [Telegram](https://telegram.org/) messenger API that stores hours logs in MongoDB.

### Installation & setup

1. Download [Telegram app](https://telegram.org/apps) and set it up.

2. Text to [@BotFather](https://telegram.me/botfather) and follow instructions to create a new bot & get `api_token`.

    See Official docs for [Bot API](https://core.telegram.org/bots).

3. Install npm package.
    ```
    $ npm i didactic-quack --save
    ```

4. Rename `example.conf.json` to `conf.json`, provide `uriDev` for mongodb.
  

## Usage

#### In `app.js`

```javascript
var DQ = require('didactic-quack');
       
var dq = new DQ({
    "parent": "your_telegram_id",
    "host": "https://api.telegram.org/bot",
    "token": "your_telegram_bot_api_token"
});
   
dq.getUpdates();

```

Change values of `parent` and `token` to `you_telegram_id` (can be fetched using Telergam API) and `your_telegram_bot_api_token`.

#### Run:

 ```
$ node app.js
```

#### Commands

Text this commands directly to you newly created bot.

* `/time` - returns current time.

* `/log <project> | <hours> | <details>` - logs stuff to MongoDB collection. 

`<project>` - `String`

`<hours>` - `Double`

`<details>` - `String`

#### Accessing data

```
$ mongo test

$ db.hours.find()
```


## License

GNU AGPL
