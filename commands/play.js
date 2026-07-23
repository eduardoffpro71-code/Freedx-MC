const {
    joinVoiceChannel,
    createAudioPlayer
} = require("@discordjs/voice");

const play = require("play-dl");

const queues = require("../music/queue");
const { playSong } = require("../music/player");

function convertDuration(duration) {
    if (!duration) return 0;

    const parts = duration.split(":").map(Number);

    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 0;
}

module.exports = {

    name: "play",

    async execute(message, args) {

        const voice = message.member.voice.channel;

        if (!voice) {
            return message.reply("🎤 Entre em um canal de voz primeiro!");
        }

        const query = args.join(" ");

        if (!query) {
            return message.reply("🎵 Digite o nome da música ou link!");
        }

        const loading = await message.reply("🔎 Procurando música...");

        let result;

        try {
            result = await play.search(query, {
                limit: 1
            });
        } catch (error) {
            console.log(error);
            return loading.edit("❌ Erro ao procurar música.");
        }

        if (!result || result.length === 0) {
            return loading.edit("❌ Música não encontrada.");
        }

        const song = {
            title: result[0].title,
            url: `https://www.youtube.com/watch?v=${result[0].id}`,
            thumbnail: result[0].thumbnails?.[0]?.url || null,
            duration: result[0].durationRaw || "0:00",
            requestedBy: message.author.username
        };

        let serverQueue = queues.getQueue(message.guild.id);

        if (
            serverQueue &&
            serverQueue.voiceChannel &&
            serverQueue.voiceChannel.id !== voice.id
        ) {
            return loading.edit("❌ Já estou tocando em outro canal de voz.");
        }

        if (!serverQueue) {

            const player = createAudioPlayer();

            const connection = joinVoiceChannel({
                channelId: voice.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            connection.subscribe(player);

            serverQueue = queues.createQueue(message.guild.id, {
                voiceChannel: voice,
                textChannel: message.channel,
                connection,
                player,
                songs: [],
                loop: false,
                volume: 50,
                current: null,
                startedAt: null,
                duration: 0,
                panelMessage: null
            });

            console.log(`🔊 Entrou no canal: ${voice.name}`);
        }

        serverQueue.songs.push(song);

        if (!serverQueue.current) {
            serverQueue.current = song;
            serverQueue.duration = convertDuration(song.duration);

            await playSong(message.guild, song);
        }

        await loading.edit(`🎵 Adicionado: **${song.title}**`);
    }

};