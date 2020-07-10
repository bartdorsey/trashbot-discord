import fetch from "node-fetch";

const fetchDog = async (breed: any) => {
    const response = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random`
    );
    if (response.ok) {
        const dog = await response.json();
        if (dog.status === "success") {
            return dog.message;
        } else {
            throw new Error(`Couldn't fetch a ${breed}`);
        }
    }
}

export default {
    name: "dogme",
    description: "Send a random dog pic for a breed",
    cooldown: 5,
    async execute(
        message: { channel: { send: (arg0: object | string) => void } },
        args: string[] | [any]
    ) {
        const [breed] = args;
        if (!breed) {
            return message.channel.send("You have to supply a breed.");
        }
        try {
            const url = await fetchDog(breed);
            message.channel.send({
                embed: {
                    image: {
                        url,
                    },
                },
            });
        } catch (e) {
            message.channel.send("Whoops, I couldn't get a dog.");
            console.error(e);
        }
    },
};
