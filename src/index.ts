import axios from "axios";
import { Client, Intents, TextChannel } from "discord.js";

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const client = new Client({ intents });

(async () => {
    await client.login(process.env.TOKEN).catch(console.error);

    client.once("ready", () => console.log("ready"));

    const channel = client.channels.cache.get(process.env.WRITING_CHANNEL_ID!) as TextChannel;

    while (1) {
        const { data } = await axios.get(process.env.LEADERBOARD_URI!);
        channel.sendTyping();
        const top = data.slice(3, 6) as { username: string }[];
        const adapted = top.map(({ username }, idx) => `${idx + 1}: ${username}`);
        const stringList = adapted.join("\n");
        await channel.send(stringList);
        await new Promise(r => setTimeout(r, Number(process.env.REFRESH_TIME)));
    }
})();
