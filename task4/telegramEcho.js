import 'dotenv/config';

import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_TOKEN;
const chatId = process.env.TG_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const firstName = msg.chat.first_name;
    const lastName = msg.chat.last_name;
    const text = msg.text; 

    if (text === 'photo') {
        const response = await axios.get('https://picsum.photos/200/300');
        await bot.sendPhoto(chatId, response.request.res.responseUrl);
    } else {
        await bot.sendMessage(chatId, `You just wrote: '${msg.text}'`);
    }
    console.log(`Пользователь ${firstName} ${lastName} отправил: ${text}`);
});
