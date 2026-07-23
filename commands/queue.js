module.exports = {
    name: "queue",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue || serverQueue.songs.length === 0) {
            return message.reply("📭 A fila está vazia.");
        }

        let lista = serverQueue.songs
            .map((song, index) => `${index + 1}. ${song.title}`)
            .join("\n");

        message.reply(`🎶 Fila de músicas:\n${lista}`);

    }
};