const Discord = require('discord.js')
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents, partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER", "REACTION"] })
require('dotenv').config()

module.exports = client

client.on('ready', async() => {
    console.log(`${client.user.tag} is now online!`)
})

client.login(process.env.DISCORD_TOKEN)