const remove = require('array-remove');
const { calcCrow } = require('../GPS');
const { users } = require('../users');

// max distance in km to search friends
const MAX_DISTANCE = 10;

const checkGPSExistince = id => {
  if (users[id] !== {}) {
    return true;
  }
  return false;
};

function searchFriends(bot, lon, lat, peer) {
  if (!checkGPSExistince(peer.id)) {
    bot.sendTextMessage(
      peer,
      'Похоже что вы не отправили свои координаты, для начала поделитесь своим местоположением.'
    );
    return [];
  }

  const IDs = Object.keys(users).map(key => {
    const lat2 = users[key].lat;
    const lon2 = users[key].lon;

    if (calcCrow(lat, lon, lat2, lon2) < MAX_DISTANCE) {
      return key;
    }
    return false;
  });

  // exlude client id from response
  const index = IDs.findIndex(x => x === `${peer.id}`);
  if (index !== -1) {
    remove(IDs, index);
  }

  // exlude undefined/false
  return IDs.filter(Number);
}

async function mainSearch(bot, peer) {
  const { lon, lat } = users[peer.id];
  const IDs = searchFriends(bot, lon, lat, peer);
  console.log(IDs);
  if (IDs.length !== 0) {
    try {
      bot.sendTextMessage(peer, 'Рядом с вами находятся пользователи с никнеймами:');
      await IDs.map(async id => {
        try {
          const user = await bot.getUser(+id);
          await bot.sendTextMessage(peer, `@${user.nick}`);
        } catch (error) {
          console.log(error);
          bot.sendTextMessage(peer, 'Что-то пошло не так. Пользователя не существует.');
        }
      });
    } catch (error) {
      console.log(error);

      bot.sendTextMessage(peer, 'Что-то пошло не так.');
    }

    await setTimeout(() => {
      bot.sendTextMessage(peer, 'Добавьте их в кооп коннект и начните общение!');
    }, 100);
  } else {
    bot.sendTextMessage(peer, 'Похоже, что рядом никого нет.');
  }
}

module.exports = {
  mainSearch
};
