const client = require("../index")
const Discord = require("discord.js")
const canvacord = require("canvacord")
const { Database } = require("quickmongo")
const mongoDBURL = process.env.MONGODBURL
const quickmongo = new Database(mongoDBURL)

client.on("guildMemberAdd", async (member) => {

    const autoRoleCheck = await quickmongo.fetch(`autorole-${member.guild.id}`)
    const getMemberRole = await quickmongo.fetch(`memberrole-${member.guild.id}`)
    const memberRole = member.guild.roles.cache.get(getMemberRole)

    const welcomeChannelCheck = await quickmongo.fetch(`welcome-${member.guild.id}`)

    if (autoRoleCheck) {
        member.roles.add(memberRole).catch(err => console.log(err))
    }

    const welcomer = new canvacord.Welcomer()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setMemberCount(member.guild.memberCount)
        .setGuildName(member.guild.name)
        .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "png" }))
        .setBackground("https://cdn.discordapp.com/banners/536238813119381524/1ff11c559c04e5127dd897b02d67a86e.png?size=2048")
        .setColor("title", "#2f35e0")
        .setColor("title-border", "#ffffff")
        .setColor("avatar", "#2f35e0")
        .setColor("username", "#000000")
        .setColor("username-box", "#c6e2ff")
        .setColor("hashtag", "#faebd7")
        .setColor("discriminator", "#000000")
        .setColor("discriminator-box", "#2f35e0")
        .setColor("message", "#faebd7")
        .setColor("message-box", "#2f35e0")
        .setColor("member-count", "#fefede")
        .setColor("background", "#2f35e0")
        .setColor("border", "#faebd7")

    if (welcomeChannelCheck) {

        const getWelcomeChannel = await quickmongo.get(`welcome-${member.guild.id}`)
        const welcomeChannel = member.guild.channels.cache.get(getWelcomeChannel)

        welcomer.build().then(data => {
            const attachment = new Discord.MessageAttachment(data, 'welcomer.png')

            welcomeChannel.send({ content: `Hey, ${member.user}, welcome to **${member.guild.name}**!`, files: [attachment] })
        })

        member.send(`Hey, welcome to **${member.guild.name}**! Thanks for joining!`).catch(err => console.log(err))

    } else return

})