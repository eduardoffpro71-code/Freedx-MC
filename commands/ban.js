const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ban",

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ Você não tem permissão para banir membros.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Mencione um usuário para banir.");
        }

        const reason = args.slice(1).join(" ") || "Sem motivo";

        try {
            await member.ban({ reason });

            message.reply(`🔨 ${member.user.tag} foi banido.\n📝 Motivo: ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Não foi possível banir esse usuário.");
        }
    }
};