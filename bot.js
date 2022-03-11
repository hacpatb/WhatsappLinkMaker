//docker run -d -e token="" --name="whatsapp_bot" hacpatb/whatsapp-get-dialog-link-bot

const TG = require('telegram-bot-api'); //https://github.com/mast/telegram-bot-api
const parsePhoneNumber = require('libphonenumber-js');

const startMessage = `Бот, который спасет вашу телефонную книгу от добавления ненужных людей.
Для написания в WhatsApp или Telegram необходимо добавлять человека в контакты, что не всегда удобно и нужно.
Вместо этого, можно скинуть боту номер телефона, а в ответ получите ссылку, пройдя по которой откроется диалог с нужным вам контактом`;
const country = 'RU';

const whatsappUrlTemplate = 'https://api.whatsapp.com/send?phone=';
const telegramUrlTemplate = 'https://t.me/';

if( process.env.token == undefined || process.env.token == '' ){
    throw 'Токен не задан';
}

const api = new TG( {token: process.env.token} );
const messageProvider = new TG.GetUpdateMessageProvider();

api.setMessageProvider(messageProvider);
api.start()
.then( () => { console.log('API is started') } )
.catch(console.err);

api.on('update', update => {

    const chat_id = update.message.chat.id
    const message_text = update.message.text;

    if(message_text == '/start'){
        api.sendMessage({
            chat_id: chat_id,
            text: startMessage,
            parse_mode: 'Markdown',
        });
    }
    else {
        const phoneNumber = parsePhoneNumber( message_text , country)
        if( phoneNumber.isValid() ){
            api.sendMessage({
                chat_id: chat_id,
                text: `WhatsApp: ${whatsappUrlTemplate}${phoneNumber.number}\nTelegram: ${telegramUrlTemplate}${phoneNumber.number}`,
                disable_web_page_preview: 'true',
                parse_mode: 'Markdown'
            });
        }
        else {
            api.sendMessage({
                chat_id: chat_id,
                text: `Что-то с номером не так ${message_text}`,
                disable_web_page_preview: 'true',
                parse_mode: 'Markdown'
            });
        } 
    }
});

