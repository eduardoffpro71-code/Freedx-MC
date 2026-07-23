const {
    createAudioResource,
    AudioPlayerStatus,
    StreamType
} = require("@discordjs/voice");

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const YTDlpWrap = require("yt-dlp-wrap").default;

const queues = require("./queue");


const ytDlpPath = path.join(
    process.cwd(),
    "yt-dlp"
);


if (fs.existsSync(ytDlpPath)) {

    try {

        fs.chmodSync(
            ytDlpPath,
            0o755
        );

        console.log("✅ yt-dlp permissão OK");

    } catch (e) {

        console.log(
            "❌ Erro permissão:",
            e.message
        );

    }

}


console.log(
    "🎵 yt-dlp:",
    ytDlpPath
);


const ytDlp = new YTDlpWrap(
    ytDlpPath
);



function durationToSeconds(duration) {

    if (!duration)
        return 0;


    const p = duration.split(":").map(Number);


    if (p.length === 2)
        return p[0] * 60 + p[1];


    if (p.length === 3)
        return p[0] * 3600 + p[1] * 60 + p[2];


    return 0;

}




async function playSong(guild, song) {

    const queue = queues.getQueue(
        guild.id
    );


    if (!queue || !song)
        return;


    queue.playing = true;


    console.log(
        `🎵 Tocando: ${song.title}`
    );


    try {

        const cookies = path.join(
            process.cwd(),
            "cookies.txt"
        );


        console.log(
            "🍪 Cookies:",
            fs.existsSync(cookies)
        );


        const args = [

            song.url,

            "-f",
            "bestaudio/best",

            "--no-playlist",

            "--no-warnings",

            "--no-check-certificates",

            "--force-ipv4",

            "--geo-bypass",

            "--extractor-args",
            "youtube:player_client=android,web",

            "--user-agent",
            "Mozilla/5.0",

            "--no-part",

            "-o",
            "-"

        ];


        if (fs.existsSync(cookies)) {

            args.push(
                "--cookies",
                cookies
            );

        }



        const stream = ytDlp.execStream(
            args
        );



        stream.on(
            "error",
            err => {

                console.log(
                    "❌ Erro yt-dlp:",
                    err.message
                );

                queue.playing = false;

            }
        );



        const ffmpegProcess = spawn(
            ffmpeg,
            [

                "-i",
                "pipe:0",

                "-f",
                "s16le",

                "-ar",
                "48000",

                "-ac",
                "2",

                "-vn",

                "-loglevel",
                "error",

                "pipe:1"

            ]
        );



        ffmpegProcess.stderr.on(
            "data",
            data => {

                console.log(
                    "FFMPEG:",
                    data.toString()
                );

            }
        );



        stream.pipe(
            ffmpegProcess.stdin
        );



        queue.ffmpegProcess =
            ffmpegProcess;



        const resource =
            createAudioResource(
                ffmpegProcess.stdout,
                {
                    inputType: StreamType.Raw,
                    inlineVolume: true
                }
            );



        if (resource.volume) {

            resource.volume.setVolume(
                (queue.volume || 50) / 100
            );

        }



        queue.resource = resource;

        queue.current = song;


        queue.duration =
            durationToSeconds(
                song.duration
            );



        queue.player.play(
            resource
        );



        queue.player.once(
            AudioPlayerStatus.Playing,
            () => {

                queue.startedAt =
                    Date.now();


                console.log(
                    "▶️ Música começou!"
                );

            }
        );



        queue.player.once(
            AudioPlayerStatus.Idle,
            () => {

                console.log(
                    "⏹️ Música terminou"
                );


                queue.playing = false;



                if (queue.ffmpegProcess) {

                    queue.ffmpegProcess.kill();

                    queue.ffmpegProcess = null;

                }



                if (!queue.loop) {

                    queue.songs.shift();

                }



                queue.current = null;



                if (queue.songs.length) {

                    playSong(
                        guild,
                        queue.songs[0]
                    );

                }

            }
        );


    } catch (error) {

        console.log(
            "❌ Erro player:",
            error.message
        );


        queue.playing = false;

    }

}



module.exports = {

    playSong,

    durationToSeconds

};