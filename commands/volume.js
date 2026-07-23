const isDJ = require("../utils/permissions");

module.exports = {
    name: "volume",

    async execute(message, args) {

        if (!isDJ(message)) {
            return message.reply("❌ Você precisa ser DJ ou Administrador.");
        }

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("❌ Não tem música tocando.");
        }

        const volume = Number(args[0]);

        if (!volume || volume < 1 || volume > 100) {
            return message.reply("🔊 Use: !volume 1 até 100");
        }

        serverQueue.volume = volume;

        message.reply(`🔊 Volume alterado para ${volume}%`);

    }
};