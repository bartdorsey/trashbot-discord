import fetch from "node-fetch";

const fetchBreeds = async () => {
    const url = `https://dog.ceo/api/breeds/list/all`
    const response = await fetch(url);
    if (response.ok || response.status === 404) {
        const breeds = await response.json();
        if (breeds.status === "success") {
            return breeds.message;
        } else {
            throw new Error(`Couldn't fetch the list of breeds.`);
        }
    } else {
        throw new Error(`Couldn't fetch the list of breeds.`);   
    }
}

export default {
    name: "breeds",
    description: "list the available breeds",
    cooldown: 5,
    async execute(
        message: any,
        args: string[]
    ) {
        try {
            const breeds = await fetchBreeds();
            let breedsString = '';
            Object.entries(breeds).forEach(([breed, subbreeds]: any[]) => {
                breedsString += `${breed}\n`;
                if (subbreeds.length) {
                    subbreeds.forEach((subbreed: string) => {
                        breedsString += `\t⮡  ${subbreed}\n`;
                    });
                }
            });
            message.author.dmChannel.send(breedsString);
        } catch (e) {
            message.author.dmChannel.send(e.message);
            console.error(e);
        }
    }
};
