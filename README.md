# didactic-quack
:pencil: Instantly logging hours though a message.

Wrapper around [Telegram](https://telegram.org/) messenger API that stores hours logs in MongoDB.

### Installation

1. Download [Telegram app](https://telegram.org/apps) and set it up.

2. Text to [@BotFather](https://telegram.me/botfather) and follow instructions to create a new bot & get `api_token`.

    See Official docs about [Bot API](https://core.telegram.org/bots).

3. Clone the repo
    ```
    $ git clone https://github.com/frenchbread/didactic-quack.git
    ```

4. Rename `example.conf.json` to `conf.json`, provide `uriDev` for mongodb & `api_token`.  

5. Run
    ```
    $ node app.js
    ```

## Usage

### Commands

Text this commands directly to you newly created bot.

* `/time` - returns current time.

* `/log <project> | <hours> | <details>` - logs stuff to MongoDB collection. 

`<project>` - `String`
`<hours>` - `Double`
`<details>` - `String`

### Accessing data

```
$ mongo test

$ db.hours.find()
```


### License

GNU AGPL