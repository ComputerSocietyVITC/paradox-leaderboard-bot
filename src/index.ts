import axios from "axios";
import { Client, Intents } from "discord.js";

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const client = new Client({ intents });

let sleeping = false;

(async () => {
    await client.login(process.env.TOKEN).catch(console.error);

    client.once("ready", () => console.log("ready"));

    client.on("messageCreate", async message => {
        if (message.content === "#ping") {
            message.channel.send("pong");
            return;
        }
        if (message.content === "#lb") {
            if (sleeping) {
                await message.reply("Leaderboard was just requested");
                return;
            }
            sleeping = true;
            const { data } = await axios.get(process.env.LEADERBOARD_URI!);
            message.channel.sendTyping();
            const top = data.slice(3, 16) as { username: string }[];
            const adapted = top
                .map(({ username }, idx) => `${idx + 1}: ${username}`)
                .filter(x => !x.includes("Admin"));
            const stringList = adapted.join("\n");
            await message.channel.send(stringList);
            new Promise(resolve => setTimeout(resolve, 20_000)).then(() => (sleeping = false));
        }
    });
})();
