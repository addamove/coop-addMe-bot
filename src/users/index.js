const users = {
  //   111971177: { lon: 37.6329939, lat: 55.787481 },
  //   1974743181: { lon: 37.632265, lat: 55.78724399999999 }
};

function init(id) {
  users[id] = {};
}

module.exports = {
  users,
  init
};
