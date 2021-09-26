require("dotenv").config()
const { Database } = require("quickmongo")
const mongoDBURL = process.env.MONGODBURL
const quickmongo = new Database(mongoDBURL)

module.exports = {
    name: "setup",
    aliases: ["set"],
    usage: ".set",
    description: "Sets up the server",
    UserPerms: ["ADMINISTRATOR"],
    cooldown: 5,

    async execute(client, message, cmd, args, Discord) {

        // If guild has no choice

        let choice = args[0]

        const noChoiceEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("No Choice Selected")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription("Type any description you want")
            .addField('\u200B', "__General__")
            .addField("Welcome Channel", "Section: `welcome`")

        if (!choice) return message.reply({ embeds: [noChoiceEmbed] })

    }

}