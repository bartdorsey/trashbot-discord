const POIs = [
  "🏖 Sweaty Sands",
  "🏡 Pleasant Park",
  "🏭 Steamy Stacks",
  "🌽 Frenzy Farm",
  "🌿 Holly Hedges",
  "🏯 The Fortilla",
  "🎣 Lazy Lake",
  "🛍 Retail Row",
  "😹 Catty Corner",
  "🌷 Misty Meadows",
  "🕵 The Authority",
  "🏠 Salty Springs",
];

export default {
    name: 'drop',
    description: 'Where we droppin?',
    cooldown: 5,
    execute(message: { channel: { send: (arg0: string) => void; }; }, args: any) {
        const randomIndex = Math.floor(Math.random() * POIs.length);
        const POI = POIs[randomIndex];
        message.channel.send(`We droppin' ${POI}, Let's Go!`);
    },
};
