import fetch from "node-fetch";
import dogme from './dogme';

module.exports = {
  name: "pugme",
  description: "Send a random pug",
  cooldown: 5,
  async execute(message: any, args: Array<any>) {
    return await dogme.execute(message, ['pug']);
  }
};
