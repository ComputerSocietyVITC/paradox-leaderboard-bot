import axios from "axios";
import { Client, Intents } from "discord.js";

type User = { username: string; currentLevel: number };

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const client = new Client({ intents });

let leaderboard: User[] = [];

const fetchLeaderboard = async () => {
    const response = await axios.get(process.env.LEADERBOARD_URI!);
    leaderboard = response.data as User[];
    setTimeout(fetchLeaderboard, 60_000);
};

(async () => {
    await fetchLeaderboard();

    await client.login(process.env.TOKEN).catch(console.error);

    client.once("ready", () => console.log("ready"));

    client.on("messageCreate", async message => {
        if (message.content === "^ping") {
            message.channel.send("pong");
            return;
        }
        if (message.content === "^lb") {
            const msg = await message.channel.send("Fetching leaderboard...");
            msg.edit(
                [
                    "**Leaderboard** (updates every 2 minutes)",
                    ...leaderboard
                        .slice(0, 15)
                        .filter(({ username }) => !username.includes("Admin"))
                        .slice(0, 10)
                        .map(
                            ({ username, currentLevel }) =>
                                `\`${username}\` is at level ${currentLevel}`
                        ),
                ].join("\n")
            );
        }
    });
})();
