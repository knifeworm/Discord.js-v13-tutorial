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

        const toggleEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("‼ - Please provide a valid option between 'enable' or 'disable'!")

        const noChoiceEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("No Choice Selected")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription("Type any description you want")
            .addField('\u200B', "__General__")
            .addField("Welcome Channel", "Section: `welcome`", true)
            .addField("Leave Channel", "Section: `leave`", true)
            .addField("Auto Role", "Section: `autorole`", true)
            .addField("Member Role", "Section: `memberrole`", true)

        if (!choice) return message.reply({ embeds: [noChoiceEmbed] })

        // Getting the Welcome Channel Status

        const getWelcomeChannel = await quickmongo.get(`welcome-${message.guild.id}`)
        const welcomeChannelCheck = await quickmongo.fetch(`welcome-${message.guild.id}`)

        let welcomeChannelStatus
        // You've to write let, if you write const it won't work, cause const is not re-assignable

        if (welcomeChannelCheck) {
            welcomeChannelStatus = `<#${getWelcomeChannel}>`
        } else welcomeChannelStatus = "`No Channel Set`"

        // Getting the Leave Channel Status

        const getLeaveChannel = await quickmongo.get(`leave-${message.guild.id}`)
        const leaveChannelCheck = await quickmongo.fetch(`leave-${message.guild.id}`)

        let leaveChannelStatus
        // You've to write let, if you write const it won't work, cause const is not re-assignable

        if (leaveChannelCheck) {
            leaveChannelStatus = `<#${getLeaveChannel}>`
        } else leaveChannelStatus = "`No Channel Set`"

        // Getting the Member Role Status

        const getMemberRole = await quickmongo.get(`memberrole-${message.guild.id}`)
        const memberRoleCheck = await quickmongo.fetch(`memberrole-${message.guild.id}`)

        let memberRoleStatus

        if (memberRoleCheck) {
            memberRoleStatus = `<@&${getMemberRole}>`
        } else memberRoleStatus = "`No Role Set`"

        // Getting the Auto Role Status

        const autoRoleCheck = await quickmongo.fetch(`autorole-${message.guild.id}`)

        let autoRoleStatus

        if (autoRoleCheck) {
            autoRoleStatus = "🟢 (ON)"
        } else autoRoleStatus = "🔴 (OFF)"

        // Setting up the Member Role

        if (choice === "memberrole") {

            const memberRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

            if (!memberRole) return message.reply("Please mention a role to set as Member role!")

            await quickmongo.set(`memberrole-${message.guild.id}`, memberRole.id)

            message.reply(`${memberRole} is now set as Member Role`)

        }

        // Setting up the Auto Role

        if (choice === "autorole") {

            const toggling = ["disable", "enable"]
            if (!toggling.includes(args[1])) return message.reply({ embeds: [toggleEmbed] })

            if (args[1] === "enable") {

                if (!memberRoleCheck) return message.reply("Set up the Member Role first!")

                if ((await quickmongo.fetch(`autorole-${message.guild.id}`)) === null) {

                    await quickmongo.set(`autorole-${message.guild.id}`, true)
                    return message.reply("Auto role is now enabled!")

                } else if ((await quickmongo.fetch(`autorole-${message.guild.id}`)) === false) {

                    await quickmongo.set(`autorole-${message.guild.id}`, true)
                    return message.reply("Auto role is now enabled!")

                } else return message.reply("Auto role is already enabled!")

            }

            if (args[1] === "disable") {

                if ((await quickmongo.fetch(`autorole-${message.guild.id}`)) === true) {

                    await quickmongo.delete(`autorole-${message.guild.id}`)
                    return message.reply("Auto role is now disabled")

                } else return message.reply("Auto role is already disabled!")

            }

        }

        // Setting up the Welcome Channel

        if (choice === 'welcome') {

            const toggling = ["disable", "enable"]
            if (!toggling.includes(args[1])) return message.reply({ embeds: [toggleEmbed] })

            const welcomeChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])

            if (args[1] === "enable") {

                if (!welcomeChannel) return message.reply("Please mention a channel to set as Welcome Channel!")

                quickmongo.set(`welcome-${message.guild.id}`, welcomeChannel.id)

                message.reply(`${welcomeChannel} is now set as Welcome Channel`)

            }

            if (args[1] === "disable") {

                if (!quickmongo.has(`welcome-${message.guild.id}`)) return message.reply("Welcome channel is already disabled!")

                await quickmongo.delete(`welcome-${message.guild.id}`)
                message.reply("Welcome Channe is now disabled")

            }

        }

        // Setting up the Leave Channel

        if (choice === 'leave') {

            const toggling = ["disable", "enable"]
            if (!toggling.includes(args[1])) return message.reply({ embeds: [toggleEmbed] })

            const leaveChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2])

            if (args[1] === "enable") {

                if (!leaveChannel) return message.reply("Please mention a channel to set as Leave Channel!")

                quickmongo.set(`leave-${message.guild.id}`, leaveChannel.id)

                message.reply(`${leaveChannel} is now set as Leave Channel`)

            }

            if (args[1] === "disable") {

                if (!quickmongo.has(`leave-${message.guild.id}`)) return message.reply("Leave channel is already disabled!")

                await quickmongo.delete(`leave-${message.guild.id}`)
                message.reply("Leave Channel is now disabled")

            }

        }

        // Getting Server's Config

        if (choice === 'config') {

            const configEmbed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle(`${message.guild.name} Server's Configuration`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription("Type any description you want")
                .addField('\u200B', "__General__")
                .addField("Welcome Channel", `${welcomeChannelStatus}`, true)
                .addField("Leave Channel", `${leaveChannelStatus}`, true)
                .addField("Auto Role", `\`${autoRoleStatus}\``, true)
                .addField("Member Role", `${memberRoleStatus}`, true)

            message.reply({ embeds: [configEmbed] })

        }

    }

}