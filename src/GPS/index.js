const { users } = require('../users');

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}

// This function takes in latitude and longitude of two location and returns
//  the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1c = toRad(lat1);
  const lat2c = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1c) * Math.cos(lat2c);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function takeMyGPS(lon, lat, peer) {
  // delete GPS coordinates after one day
  setTimeout(() => {
    users[peer.id] = {};
  }, 86400000);

  users[peer.id] = {
    lon,
    lat
  };
}

module.exports = {
  calcCrow,
  takeMyGPS
};
