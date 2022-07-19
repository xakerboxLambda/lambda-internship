import 'dotenv/config';

import https from 'https';

const token = process.env.TG_TOKEN;
const chatId = process.env.TG_CHAT_ID;


function sendMessage(text) {
    https.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`, (res) => { })
}
function sendPhoto
    (text) {
    https.get(`https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}&photo=${text}`, (res) => { })
}
function showHelp() {
    return console.log(`\nEnter 'message' or 'm' and 'YOUR MESSAGE' to send a message 
Enter 'photo' or 'p' and 'DRAG PHORO OR PUT PHOTO URL' to send a photo\n`)
}

function main() {
    console.log(`Enter 'npm run start <YOUR MESSAGE> OR <DRAG_YOUR_PHOTO> OR <TYPE_PHOTO_URL>'`);
    const command = process.argv[2];
    const commandParam = process.argv[3];

    if (!command) {
        console.log(`\nValid commands: 'message' or 'm', 'photo' or 'p'\n
If you need help, type 'node <YOUR_FILE_NAME>.js --help'\n`)
    }
    if (command === 'message' || command === 'm') {
        if (!commandParam) {
            console.log(`\nEnter your message, please\n
Need help? Type , '--help'\n`)
        } else sendMessage(commandParam)
    }
    if (command === 'photo' || command === 'p') {
        if (!commandParam) {
            console.log(`\nEnter valid photo URL, please\n
Need help? Type , '--help'\n`)
        } else sendPhoto(commandParam)
    }
    if (command === '--help') {
        showHelp()
    }
}


main();