module.exports = {
    name: "nowplaying",

    async execute(message) {

        const queue = require("../music/queue");

        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue || serverQueue.songs.length === 0) {
            return message.reply("❌ Não tem música tocando.");
        }

        const song = serverQueue.songs[0];

        message.reply(`🎵 Tocando agora: **${song.title}**`);

    }
};