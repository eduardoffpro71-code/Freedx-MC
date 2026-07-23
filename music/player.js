const {
    createAudioResource,
    AudioPlayerStatus,
    StreamType
} = require("@discordjs/voice");

const { spawn } = require("child_process");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");

const queues = require("./queue");

function durationToSeconds(duration) {
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

async function playSong(guild, song) {

    const serverQueue = queues.getQueue(guild.id);

    if (!serverQueue) return;

    if (serverQueue.playing) return;

    serverQueue.playing = true;

    console.log(`🎵 Tocando: ${song.title}`);

    const ytdlp = path.join(process.cwd(), "yt-dlp.exe");

    const yt = spawn(ytdlp, [
        "-f",
        "bestaudio",
        "--no-playlist",
        "-o",
        "-",
        song.url
    ]);

    const ffmpeg = spawn(ffmpegPath, [
        "-i",
        "pipe:0",
        "-f",
        "s16le",
        "-ar",
        "48000",
        "-ac",
        "2",
        "-loglevel",
        "error",
        "pipe:1"
    ]);

    yt.stdout.pipe(ffmpeg.stdin);

    const resource = createAudioResource(ffmpeg.stdout, {
        inputType: StreamType.Raw,
        inlineVolume: true
    });

    if (resource.volume) {
        resource.volume.setVolume(serverQueue.volume / 100);
    }

    serverQueue.current = song;
    serverQueue.duration = durationToSeconds(song.duration);

    serverQueue.player.play(resource);

    serverQueue.player.once(AudioPlayerStatus.Playing, () => {
        serverQueue.startedAt = Date.now();
        console.log("▶️ Música começou!");
    });

    serverQueue.player.once(AudioPlayerStatus.Idle, async () => {

        console.log("⏹️ Música terminou");

        serverQueue.playing = false;

        serverQueue.songs.shift();

        serverQueue.current = null;
        serverQueue.startedAt = null;
        serverQueue.duration = 0;

        if (serverQueue.songs.length > 0) {
            await playSong(guild, serverQueue.songs[0]);
        }

    });

    serverQueue.player.once("error", error => {
        console.log("❌ Erro Player:", error.message);
        serverQueue.playing = false;
    });

    yt.once("error", error => {
        console.log("❌ Erro yt-dlp:", error.message);
        serverQueue.playing = false;
    });

    ffmpeg.once("error", error => {
        console.log("❌ Erro FFmpeg:", error.message);
        serverQueue.playing = false;
    });
}

module.exports = {
    playSong
};