const Discord = require('discord.js')
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents, partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER", "REACTION"] })
require('dotenv').config()

module.exports = client

const fs = require('fs')

client.commands = new Discord.Collection()
client.events = new Discord.Collection();

['common_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord)
})

client.login(process.env.DISCORD_TOKEN)