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


// caminho do yt-dlp baixado pelo install-yt-dlp.js
const ytDlpPath = path.join(
    process.cwd(),
    "yt-dlp"
);


// adiciona permissão no Linux (Railway)
if (fs.existsSync(ytDlpPath)) {
    try {
        fs.chmodSync(
            ytDlpPath,
            0o755
        );
    } catch (err) {
        console.log(
            "⚠️ Não conseguiu dar permissão no yt-dlp"
        );
    }
}


console.log(
    "🎵 yt-dlp caminho:",
    ytDlpPath
);


const ytDlp = new YTDlpWrap(
    ytDlpPath
);



function durationToSeconds(duration) {

    if (!duration) return 0;

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


        const stream = ytDlp.execStream([

            song.url,

            "-f",
            "bestaudio",

            "--no-playlist",

            "--quiet"

        ]);




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

                "-loglevel",
                "error",

                "pipe:1"

            ]
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



        if(resource.volume){

            resource.volume.setVolume(
                (queue.volume || 50) / 100
            );

        }



        queue.resource =
        resource;


        queue.current =
        song;


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



                if(queue.ffmpegProcess){

                    queue.ffmpegProcess.kill();

                    queue.ffmpegProcess = null;

                }



                queue.current = null;
                queue.startedAt = null;
                queue.duration = 0;



                if(!queue.loop){

                    queue.songs.shift();

                }



                if(queue.songs.length > 0){

                    playSong(
                        guild,
                        queue.songs[0]
                    );

                }


            }
        );





        ffmpegProcess.on(
            "error",
            (err)=>{

                console.log(
                    "❌ Erro FFmpeg:",
                    err.message
                );


                queue.playing = false;

            }
        );





    } catch(error){


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