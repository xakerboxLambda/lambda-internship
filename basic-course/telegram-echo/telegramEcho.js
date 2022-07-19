import 'dotenv/config';

import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const firstName = msg.chat.first_name;
    const lastName = msg.chat.last_name;
    const text = msg.text; 

    if (text === 'photo') {
        const response = await axios.get('https://picsum.photos/200/300');
        await bot.sendPhoto(msg.chat.id, response.request.res.responseUrl);
    } else {
        await bot.sendMessage(msg.chat.id, `You just wrote: '${msg.text}'`);
    }
    console.log(`User ${firstName} ${lastName} sent: ${text}`);
});
