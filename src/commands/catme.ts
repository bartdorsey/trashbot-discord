import fetch from "node-fetch";

const fetchCat = async () => {
    const response = await fetch(
        'https://api.thecatapi.com/v1/images/search'
    );
    if (response.ok) {
        const catInfo = await response.json();
        if (catInfo[0] && catInfo[0].url) {
            return catInfo[0].url;
        } else {
            throw new Error(`Couldn't fetch a cat`);
        }
    }
}

export default {
    name: "catme",
    description: "Send a random Cat Pic",
    cooldown: 5,
    async execute(message: { channel: { send: (arg0: object|string) => void; }; }, args: any) {
        try {
            const url = await fetchCat();
            message.channel.send({
                embed: {
                    image: {
                        url
                    }
                }
            });
        } catch (e) {
            message.channel.send("Whoops, I couldn't get a cat.");
            console.error(e);
        }
    },
};
