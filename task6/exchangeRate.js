import 'dotenv/config';

import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TG_TOKEN;
const appId = process.env.APP_ID;
const bot = new TelegramBot(token, { polling: true });


const weatherAndCurrencyButton = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Погода'
                },
                {
                    text: 'Курс валют'
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

const currencyButton = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'USD'
                }
            ],
            [
                {
                    text: 'EUR'
                }
            ]
        ]
    }
}

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

async function getPrivatBankCurrencies() {
    let response = { usd: { buy: 0, sell: 0 }, eur: { buy: 0, sell: 0 } }

    const responseCurrencyPrivatBank = await axios.get(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`);

    for (const elem of responseCurrencyPrivatBank.data) {
        const currency = elem['ccy'];
        if (currency === 'USD') {
            response.usd.buy = elem.buy;
            response.usd.sell = elem.sale;
        }
        if (currency === 'EUR') {
            response.eur.buy = elem.buy;
            response.eur.sell = elem.sale;
        }
    }

    return response;
}

async function getMonoBankCurrencies() {
    const usdCode = 840;
    const eurCode = 978;
    const uahCode = 980;

    try {
        let response = { usd: { buy: 0, sell: 0 }, eur: { buy: 0, sell: 0 } };

        const responseCurrencyMonoBank = await axios.get(`https://api.monobank.ua/bank/currency`);
        for (const elem of responseCurrencyMonoBank.data) {
            const currencyA = elem['currencyCodeA'];
            const currencyB = elem['currencyCodeB'];

            if (currencyA === usdCode && currencyB === uahCode) {
                response.usd.buy = elem.rateBuy;
                response.usd.sell = elem.rateSell;
            }
            if (currencyA === eurCode && currencyB === uahCode) {
                response.eur.buy = elem.rateBuy;
                response.eur.sell = elem.rateSell;
            }

        }
        return response;
    } catch (err) {
        console.log('text');
    }

    return undefined;
}

function getCurrencyMessage(monoCurrencies, privatCurrencies, currency) {
    const responseAsArray = [
        `Privat Bank:\nПокупка: ${privatCurrencies[currency].buy}, Продажа: ${privatCurrencies[currency].sell}`,
        '\n\n',
    ];
    if (typeof monoCurrencies === 'undefined') {
        responseAsArray.push('Currently can not get data from MonoBank, please try again later!')
    } else {
        responseAsArray.push(`Mono Bank:\nПокупка: ${monoCurrencies[currency].buy}, Продажа: ${monoCurrencies[currency].sell}`)
    }
    return responseAsArray.join('');
}

let globalMonoBankResponse;


bot.on('message', async (msg) => {
    if (msg.text === 'Погода') {
        await bot.sendMessage(msg.chat.id, 'Укажите интервал', intervalWeatherButton);

    } else if (msg.text === 'Каждые 3 часа') {

        const responseWeather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Dnipro&appid=${appId}`);
        const resultArrayForThreeDays = getResultForDays(responseWeather, 3);

        await bot.sendMessage(msg.chat.id, `${resultArrayForThreeDays}`, weatherAndCurrencyButton);

    } else if (msg.text === 'Каждые 6 часов') {

        const responseWeather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Dnipro&appid=${appId}`);
        const resultArrayForSixDays = getResultForDays(responseWeather, 6);

        await bot.sendMessage(msg.chat.id, `${resultArrayForSixDays}`, weatherAndCurrencyButton);

    } else if (msg.text === 'Курс валют') {
        await bot.sendMessage(msg.chat.id, 'Укажите валюту', currencyButton)

    } else if (msg.text === 'USD' || msg.text === 'EUR') {

        let monoResponse = await getMonoBankCurrencies();
        if (typeof monoResponse === 'undefined') {
            monoResponse = globalMonoBankResponse;
        } else {
            globalMonoBankResponse = monoResponse;
        }
        const privatResponse = await getPrivatBankCurrencies();
        const message = getCurrencyMessage(monoResponse, privatResponse, msg.text.toLowerCase());

        await bot.sendMessage(msg.chat.id, message, weatherAndCurrencyButton);

    } else {
        await bot.sendMessage(msg.chat.id, 'Укажите действие', weatherAndCurrencyButton)
    }
})

async function main() {
    globalMonoBankResponse = await getMonoBankCurrencies();
}

main();


