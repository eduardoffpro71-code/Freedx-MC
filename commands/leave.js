module.exports = {
    name: "leave",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("❌ Não estou em nenhum canal de voz.");
        }

        serverQueue.songs = [];

        serverQueue.player.stop();

        serverQueue.connection.destroy();

        queue.delete(message.guild.id);

        message.reply("👋 Saí do canal de voz.");

    }
};