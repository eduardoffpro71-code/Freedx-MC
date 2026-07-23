const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "timeout",

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply("❌ Você não tem permissão.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("❌ Mencione um usuário.");
        }

        const minutes = parseInt(args[1]);

        if (!minutes || minutes < 1 || minutes > 10080) {
            return message.reply("Use: !timeout @usuário <minutos>");
        }

        const reason = args.slice(2).join(" ") || "Sem motivo";

        try {
            await member.timeout(minutes * 60 * 1000, reason);

            message.reply(`⏳ ${member.user.tag} recebeu timeout de ${minutes} minuto(s).\n📝 Motivo: ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Não foi possível aplicar o timeout.");
        }
    }
};