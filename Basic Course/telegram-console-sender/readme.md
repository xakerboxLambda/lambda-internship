# Telegram console sender

This console sender will send to your telegram photos or messages with help of console commands

# Order of execution

## To run test:
1. Type in console `npm i`
2. In your `.env` enter your 
    - **TG_TOKEN** (Telegram bot token) 
    - **TG_CHAT_ID** (Chat id to send message to)
3. Start your file with\
`npm run start test:message (to send message)`\
`npm run start test:photo (to send photo)`

#

## To run program: 
1. Type in console `npm i`
2. In your `.env` enter your 
    - **TG_TOKEN** (Telegram bot token) 
    - **TG_CHAT_ID** (Chat id to send message to)
3. Start your file with\
`npm run start <YOUR_COMMAND> <'YOUR MESSAGE' OR 'DRAG_YOUR_PHOTO' OR 'TYPE_PHOTO_URL'>`

**Comands**
> `--help` : help information

> `message` or `m` : To send message

>`photo` or `p` : To send photo