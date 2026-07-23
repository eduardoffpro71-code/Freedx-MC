module.exports = {
    name: "pause",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("Não tem música tocando.");
        }

        serverQueue.player.pause();

        message.reply("⏸️ Música pausada.");

    }
};