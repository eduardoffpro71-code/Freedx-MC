const isDJ = require("../utils/permissions");

module.exports = {
    name: "skip",

    async execute(message) {

        if (!isDJ(message)) {
            return message.reply("❌ Você precisa ser DJ ou Administrador.");
        }

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("❌ Não tem música tocando.");
        }

        serverQueue.player.stop();

        message.reply("⏭️ Música pulada.");

    }
};