/*
TODO

*/

const { Bot } = require('@dlghq/dialog-bot-sdk');
const config = require('./config');
const path = require('path');
const { takeMyGPS } = require('./GPS');
const { mainSearch } = require('./search');
const { users, init } = require('./users');

const bot = new Bot(config.bot);

function help(peer) {
  bot.sendTextMessage(
    peer,
    'Пришлите мне свое местоположение и я покажу вам всех кооператоров в радиусе 10км, которые тоже хотят общения.'
  );
  bot.sendInteractiveMessage(
    peer,
    'Если вы не знаете как отправить свое местоположение нажмите на кнопку.',
    [
      {
        actions: [
          {
            id: 'h',
            widget: {
              type: 'button',
              value: 'help',
              label: 'Помощь'
            }
          }
        ]
      }
    ]
  );
}

bot.onMessage(async (peer, message) => {
  if (message.content.text === '/start') {
    help(peer);
    return true;
  }
  // check nick
  try {
    const client = await bot.getUser(peer.id);
    if (!client.nick) {
      bot.sendTextMessage(peer, 'Пожалуйста, yстановите ник прежде чем начать.');
      return true;
    }
  } catch (error) {
    console.log(error);
    bot.sendTextMessage(peer, 'Что-то пошло не так.');
  }
  // registration new user
  if (!users[peer.id]) {
    init(peer.id);
  }

  if (message.content.type === 'location') {
    takeMyGPS(message.content.longitude, message.content.latitude, peer);
    bot.sendTextMessage(peer, 'Принял ваши координаты, выполняем поиск!');

    // actually search
    mainSearch(bot, peer);
    return true;
  }

  bot.sendTextMessage(peer, "К сожалению я не понимаю текст :'C");

  help(peer);
  return false;
});

bot.onInteractiveEvent(event => {
  if (event.value === 'help') {
    bot.sendTextMessage(
      event.ref.peer,
      'Секундочку...\nСледуйте инструкциям показанным на картинках.'
    );
    bot.sendImageMessage(event.ref.peer, path.join(__dirname, `./images/1.png`));
    bot.sendImageMessage(event.ref.peer, path.join(__dirname, `./images/2.png`));
  }
});
