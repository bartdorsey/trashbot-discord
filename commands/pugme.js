const fetch = require("node-fetch");
const dogme = require('./dogme');

module.exports = {
  name: "pugme",
  description: "Send a random pug",
  cooldown: 5,
  async execute(message, args) {
    return await dogme.execute(message, ['pug']);
  }
};
