module.exports = {
    name: "loop",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("❌ Não tem música tocando.");
        }

        serverQueue.loop = !serverQueue.loop;

        if (serverQueue.loop) {
            message.reply("🔁 Loop ativado.");
        } else {
            message.reply("➡️ Loop desativado.");
        }

    }
};