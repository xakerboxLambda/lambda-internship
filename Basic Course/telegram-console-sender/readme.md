# Telegram console sender

This console sender will send to your telegram photos or messages with help of console commands

# Order of execution

## To run test:
1. Copy code to your's dev environment
2. Type in console `npm init`
3. In `.env.example` file delete `".example"` to make `.env`
4. In your `.env` enter your **Telegram token** and **Chat id**
5. Start your file with\
`npm run start test:message (to send message)`\
`npm run start test:photo (to send photo)`

#

## To run programm: 
1. Copy code to your's dev environment
2. Type in console `npm init`
3. In `.env.example` file delete `".example"` to make `.env`
4. In your `.env` enter your **Telegram token** and **Chat id**
5. Start your file with\
`npm run start <YOUR_COMMAND> <'YOUR MESSAGE' OR 'DRAG_YOUR_PHOTO' OR 'TYPE_PHOTO_URL'>`

**Comands**
> `--help` : help information

> `message` or `m` : To send message

>`photo` or `p` : To send photo