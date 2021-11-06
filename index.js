const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const messageGenerator = require('./messageGenerator')

const token = '2062125401:AAHyVxALSbJz6qIOeJZmJKjQfIy6Ck5NjJY';
const url = 'https://be-pj-desarrolloweb.herokuapp.com/';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    if (msg.text.toLowerCase() === 'hola') {
        bot.sendMessage(chatId, '🤖 Hola!, dime quien eres ingresando el siguiente comando: ').then(() => {
            return bot.sendMessage(chatId, '/iniciarsesion correo:password')
        })

    }
});


bot.onText(/\/tareas/, async (msg) => {
    const chatId = msg.chat.id;
    axios.get(url + 'bot/' + chatId).then(res => {
        if (res.data.bot.length > 0) {
            axios.get(url + 'homeworkuser/' + res.data.bot[0].user_bot.user_name)
                .then(response => {
                    let data = response.data.homeworks[0]
                    console.log(data)
                    messageGenerator.getNotas(data, bot, chatId)
                }).catch(error => {
                    console.log(error)
                    bot.sendMessage(chatId, '🤖 Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
                });
        } else {
            bot.sendMessage(chatId, '🤖 Hola! aún no estas registrado, dime quien eres ingresando el siguiente comando: ').then(() => {
                return bot.sendMessage(chatId, '/iniciarsesion correo:password')
            })
        }

    }).catch(error => {
        console.log(error)
        bot.sendMessage(chatId, '🤖 Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
    })

})

bot.onText(/\/cursos/, async(msg)=>{///cursoConect/1
    const chatId = msg.chat.id;
    axios.get(url + 'bot/' + chatId).then(res => {
        if (res.data.bot.length > 0) {
            axios.get(url + 'cursoConect/' + res.data.bot[0].user_bot.id_UserName)
                .then(response => {
                    let data = response.data.curso_conect[0]
                    console.log(data)
                    messageGenerator.getCursos(data, bot, chatId)
                }).catch(error => {
                    console.log(error)
                    bot.sendMessage(chatId, '🤖 Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
                });
        } else {
            bot.sendMessage(chatId, '🤖 Hola! aún no estas registrado, dime quien eres ingresando el siguiente comando: ').then(() => {
                return bot.sendMessage(chatId, '/iniciarsesion correo:password')
            })
        }

    }).catch(error => {
        console.log(error)
        bot.sendMessage(chatId, '🤖 Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
    })
})

///homeworkuser/amelgac3@miumg.edu.gt
bot.onText(/\/iniciarsesion (.+)/, function onLoveText(msg, match) {
    const chatId = msg.chat.id;
    let elements = match[1].split(':')
    if (elements.length === 2) {
        let urlRequest = url + 'login';
        axios.post(urlRequest,
            { user_name: elements[0], password: elements[1] })
            .then(function (response) {
                if (response.data.status === 'success') {
                    axios.post(url + 'bot', { estado_bot: 'A', user_botId: response.data.id_UserName, chatId: chatId }).then(res => { //{"estado_bot":"A", "user_botId":1,"chatId":12345678}
                        if (res.data.status === 'success') {
                            bot.sendMessage(chatId, '🤖 Hola ' + response.data.name + ' ' + response.data.last_name + '!, tus datos han sido registrados.')
                        } else if (res.data.ex.code === 'P2002') {
                            bot.sendMessage(chatId, '🤖 Tu ya te encontrabas registrado (en este u otro chat) :D ingresa /tareas para verificar tus entregas pendientes')
                        } else {
                            console.log(res.data)
                            bot.sendMessage(chatId, '🤖1 Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
                        }
                    }).catch(error => {
                        console.log(error);
                        bot.sendMessage(chatId, '🤖 2Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
                    })
                } else {
                    bot.sendMessage(chatId, '🤖 Ingresa un correo y contraseña valido')
                }
            })
            .catch(function (error) {
                console.log(error);
                bot.sendMessage(chatId, '🤖3 Sufrimos problemas tecnicos, vuelva a intentarlo en unos minutos')
            });

    } else {
        bot.sendMessage(chatId, '🤖 Ingresa un correo y contraseña valido')
    }
});