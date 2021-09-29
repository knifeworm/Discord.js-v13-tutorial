module.exports = {
    name: 'test',
    aliases: 'hi',
    description: "Just a test command",

    execute(client, message, cmd, args, Discord) {

        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("Hey!")

        message.reply({ embeds: [embed] })
    }
}