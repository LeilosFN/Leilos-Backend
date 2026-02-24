const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());

const log = require("../structs/log.js");

client.once("ready", () => {
    log.bot("Bot is up and running!");

    let commands = client.application.commands;
    let commandList = [];

    fs.readdirSync("./DiscordBot/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);

        commandList.push(command.commandInfo);
    });

    commands.set(commandList);
});

client.on("interactionCreate", interaction => {
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./DiscordBot/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

client.login(config.discord.bot_token);