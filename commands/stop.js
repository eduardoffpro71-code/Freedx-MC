const isDJ = require("../utils/permissions");

module.exports = {
    name: "stop",

    async execute(message) {

        if (!isDJ(message)) {
            return message.reply("❌ Você precisa ser DJ ou Administrador.");
        }

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("❌ Não tem música tocando.");
        }

        serverQueue.songs = [];

        serverQueue.player.stop();

        serverQueue.connection.destroy();

        queue.delete(message.guild.id);

        message.reply("⏹️ Música parada e fila limpa.");

    }
};