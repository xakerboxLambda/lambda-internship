import 'dotenv/config';

import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_TOKEN;
const appId = process.env.APP_ID;
const bot = new TelegramBot(token, { polling: true });

const weatherButton = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Погода'
                }
            ]
        ]
    }
};

const intervalWeatherButton = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Каждые 3 часа'
                }
            ],
            [
                {
                    text: 'Каждые 6 часов'
                }
            ]
        ]
    }
};

function dayOfTheWeek(num) {
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    return days[num];
}

function monthOfTheYear(num) {
    const days = ['Января', 'Февраля', 'Марта', 'Апреля', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return days[num];
}

function getResultForDays(response, hours) {
    let responseString = '';

    const mappedResponse = {};

    response.data.list.forEach((input, i) => {
        if (i % (hours / 3) !== 0) {
            return
        }
        const splittedDate = input.dt_txt.split(' ');
        const date = splittedDate[0];
        const time = splittedDate[1].slice(0, 5);
        const temp = Math.round(input.main.temp - 273.15);
        const feelsTemp = Math.round(input.main.feels_like - 273.15);

        const value = mappedResponse[date];

        if (value) {
            mappedResponse[date].push({ time, temp, feelsTemp });
        } else {
            mappedResponse[date] = [{ time, temp, feelsTemp }];
        }
    })

    for (const key of Object.keys(mappedResponse)) {
        const value = mappedResponse[key];
        const keyAsDate = new Date(key);

        responseString += `${dayOfTheWeek(keyAsDate.getDay())} ${keyAsDate.getDate()} ${monthOfTheYear(keyAsDate.getMonth() - 1)} \n`;

        for (const timeObj of value) {
            responseString += `${timeObj.time}, Темперарута: ${timeObj.temp} Ощущается как: ${timeObj.feelsTemp} \n`
        }

        responseString += '\n';

    }

    return responseString;
}


bot.on('message', async (msg) => {
    if (msg.text === 'Погода') {
        await bot.sendMessage(msg.chat.id, 'Укажите интервал', intervalWeatherButton);

    } else if (msg.text === 'Каждые 3 часа') {

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Dnipro&appid=${appId}`);
        const resultArrayForThreeDays = getResultForDays(response, 3);

        await bot.sendMessage(msg.chat.id, `${resultArrayForThreeDays}`, weatherButton);

    } else if (msg.text === 'Каждые 6 часов') {

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Dnipro&appid=${appId}`);
        const resultArrayForSixDays = getResultForDays(response, 6);

        await bot.sendMessage(msg.chat.id, `${resultArrayForSixDays}`, weatherButton);

    } else {
        await bot.sendMessage(msg.chat.id, 'Укажите действие', weatherButton)
    }
})
