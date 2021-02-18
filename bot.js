//docker run -d -e token="" --name="whatsapp_bot" hacpatb/whatsapp-get-dialog-link-bot

const TG = require('telegram-bot-api') //https://github.com/mast/telegram-bot-api
const parsePhoneNumber = require('libphonenumber-js')

const UrlTemplate = 'https://api.whatsapp.com/send?phone=7'

if( process.env.token == undefined || process.env.token == '' ){
    throw 'Токен не задан'
}

const api = new TG({
    token: process.env.token
})

// Define your message provider
const mp = new TG.GetUpdateMessageProvider()

api.setMessageProvider(mp)
api.start()
.then(() => {
    console.log('API is started')
})
.catch(console.err)

api.on('update', update => {

    const chat_id = update.message.chat.id
    const message_text = update.message.text;

    if(message_text == '/start'){
        api.sendMessage({
            chat_id: chat_id,
            text: `Бот, который спасет вашу телефонную книгу от добавления ненужных людей.\nДля написания в WhatsApp необходимо добавлять человека в контакты, что не всегда удобно и нужно.\nВместо этого, можно скинуть боту номер телефона, а в ответ получите ссылку, пройдя по которой откроется диалог с нужным вам контактом`,
            parse_mode: 'Markdown',
        })
    }
    else {
        const phoneNumber = parsePhoneNumber( message_text , 'RU')
        if( phoneNumber.isValid() ){
            api.sendMessage({
                chat_id: chat_id,
                text: `${UrlTemplate}${phoneNumber.nationalNumber}`,
                disable_web_page_preview: 'true',
                parse_mode: 'Markdown'
            })
        }
        else {
            api.sendMessage({
                chat_id: chat_id,
                text: `Что-то с номером не так ${message_text}`,
                disable_web_page_preview: 'true',
                parse_mode: 'Markdown'
            })
        } 
    }
})

