module.exports = {
    name: "resume",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("Não tem música tocando.");
        }

        serverQueue.player.unpause();

        message.reply("▶️ Música continuando.");

    }
};