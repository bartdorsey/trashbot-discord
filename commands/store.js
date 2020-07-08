const Client = require('fortnite');
const { fortniteTrackerAPI } = require('../config');
const fortnite = new Client('f0ad854f-b9de-4ada-815b-8362c7aea0e0');

module.exports = {
  name: "store",
  description: "List out the fortnite store items",
  cooldown: 5,
  async execute(message, args) {
    const items = await fortnite.store();
    items.forEach(item => {
      message.channel.send({
        embed: {
          title: item.name,
          description: `${item.vbucks} v-bucks`,
          image: {
            url: item.image
          }
        }
      })
    })
  },
};
