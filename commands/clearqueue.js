module.exports = {
    name: "clearqueue",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("❌ Não tem fila de músicas.");
        }

        serverQueue.songs = [
            serverQueue.songs[0]
        ];

        message.reply("🗑️ Fila limpa. A música atual continua tocando.");

    }
};