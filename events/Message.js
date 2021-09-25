require('dotenv').config()
const client = require("../index")
const Discord = require('discord.js')

client.on("messageCreate", async (message) => {

    if (message.author.bot || !message.guild) return

    const prefix = process.env.PREFIX

    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const cmd = args.shift().toLowerCase()

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))

    if (command) {
        command.execute(client, message, cmd, args, Discord)
    }

})