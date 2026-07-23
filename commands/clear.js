const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "clear",

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply("❌ Você não tem permissão para apagar mensagens.");
        }

        const amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100) {
            return message.reply("Use: !clear 1-100");
        }

        await message.channel.bulkDelete(amount, true);

        const msg = await message.channel.send(`🗑️ ${amount} mensagens apagadas.`);

        setTimeout(() => msg.delete().catch(() => {}), 3000);
    }
};