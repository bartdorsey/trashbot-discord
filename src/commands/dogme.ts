import fetch from "node-fetch";

const fetchDog = async (breed: string, subBreed: string) => {
    let breedFragment = `${breed}`;
    if (subBreed) {
        breedFragment += `/${subBreed}`;
    }
    const url = `https://dog.ceo/api/breed/${breedFragment}/images/random`
    const response = await fetch(url);
    if (response.ok || response.status === 404) {
        const dog = await response.json();
        if (dog.status === "success") {
            return dog.message;
        } else {
            throw new Error(`Couldn't fetch a ${breed}`);
        }
    } else {
        throw new Error(`Couldn't fetch a ${breed}`);   
    }
}

export default {
    name: "dogme",
    description: "Fetches a random dog of a certain breed.",
    usage: "`breed` `sub-breed`",
    cooldown: 5,
    async execute(
        message: { channel: { send: (arg0: object | string) => void } },
        args: string[]
    ) {
        const [breed, subBreed] = args;
        if (!breed) {
            return message.channel.send("You have to supply a breed.");
        }
        try {
            const url = await fetchDog(breed, subBreed);
            message.channel.send({
                embed: {
                    image: {
                        url,
                    },
                },
            });
        } catch (e) {
            message.channel.send(e.message);
            console.error(e);
        }
    }
};
