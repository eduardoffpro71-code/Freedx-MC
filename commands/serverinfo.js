module.exports = {
    name: "serverinfo",

    async execute(message) {

        const server = message.guild;

        message.reply(
            `📌 **Informações do servidor**\n\n` +
            `🏠 Nome: ${server.name}\n` +
            `👥 Membros: ${server.memberCount}\n` +
            `🆔 ID: ${server.id}`
        );

    }
};