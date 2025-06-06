require("dotenv").config();
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const express = require("express");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for the homepage
app.get("/", (req, res) => {
    res.send("Welcome to the Node.js Server!");
});

// Sample API route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from the API!" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    // Check if the user has Administrator permission
    const member = message.guild.members.cache.get(message.author.id);
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply("You must be an administrator to use this command.");
    }

    // Feature 1: DM users in a specific role
    if (message.content.startsWith("!dm ")) {
        const args = message.content.split(" ");
        const roleName = args[1];
        const customMessage = args.slice(2).join(" ");

        const role = message.guild.roles.cache.find((r) => r.name === roleName);
        if (!role) {
            return message.reply(`Role "${roleName}" not found.`);
        }

        const members = role.members;
        if (members.size === 0) {
            return message.reply(`No members found in the "${roleName}" role.`);
        }

        message.reply(`Sending DM to ${members.size} members in "${roleName}"...`);

        members.forEach((member) => {
            if (!member.user.bot) {
                member.send(customMessage).catch(() => {});
            }
        });
    }

    // Feature 2: Echo and delete messages starting with "!EV"
    if (message.content.startsWith("!EV ")) {
        const echoMessage = message.content.slice(4);
        message.channel.send(echoMessage);
        message.delete().catch(console.error); // Delete the original message
    }
});

client.login(process.env.DISCORD_TOKEN);