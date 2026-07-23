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



        const args = [

            song.url,

            "-f",
            "ba/b",

            "--no-playlist",

            "--no-warnings",

            "--ignore-errors",

            "--force-ipv4",

            "--retries",
            "20",

            "--fragment-retries",
            "20",

            "--socket-timeout",
            "60",


            "--extractor-args",
            "youtube:player_client=android,web",


            "--js-runtimes",
            "node",


            "--remote-components",
            "ejs:github",


            "--format-sort",
            "ext:m4a,res:1440",


            "-o",
            "-"

        ];



        if(fs.existsSync(cookies)){

            console.log(
                "🍪 Usando cookies"
            );


            args.push(
                "--cookies",
                cookies
            );

        }



        const stream =
            ytDlp.execStream(
                args
            );



        const ffmpegProcess =
            spawn(
                ffmpeg,
                [

                    "-i",
                    "pipe:0",

                    "-vn",

                    "-ac",
                    "2",

                    "-ar",
                    "48000",

                    "-f",
                    "s16le",

                    "-loglevel",
                    "error",

                    "pipe:1"

                ]
            );



        queue.ffmpegProcess =
            ffmpegProcess;



        stream.pipe(
            ffmpegProcess.stdin
        );



        stream.on(
            "error",
            err => {

                console.log(
                    "❌ yt-dlp:",
                    err.message
                );


                queue.playing = false;


                try{

                    ffmpegProcess.kill();

                }catch{}

            }
        );



        ffmpegProcess.stderr.on(
            "data",
            data => {

                const msg =
                    data.toString();


                if(msg.trim()){

                    console.log(
                        "FFMPEG:",
                        msg
                    );

                }

            }
        );



        ffmpegProcess.on(
            "close",
            code => {

                console.log(
                    "FFmpeg fechado:",
                    code
                );

            }
        );



        const resource =
            createAudioResource(
                ffmpegProcess.stdout,
                {
                    inputType: StreamType.Raw,
                    inlineVolume:true
                }
            );



        if(resource.volume){

            resource.volume.setVolume(
                (queue.volume || 50) / 100
            );

        }



        queue.resource = resource;

        queue.current = song;



        queue.player.play(
            resource
        );



        queue.player.once(
            AudioPlayerStatus.Playing,
            ()=>{

                queue.startedAt =
                    Date.now();


                console.log(
                    "▶️ Música começou!"
                );

            }
        );



        queue.player.once(
            AudioPlayerStatus.Idle,
            ()=>{


                console.log(
                    "⏹️ Música terminou"
                );


                queue.playing = false;



                if(queue.ffmpegProcess){

                    try{

                        queue.ffmpegProcess.kill();

                    }catch{}

                    queue.ffmpegProcess = null;

                }



                if(!queue.loop){

                    queue.songs.shift();

                }



                queue.current = null;



                if(queue.songs.length){

                    setTimeout(
                        ()=>{

                            playSong(
                                guild,
                                queue.songs[0]
                            );

                        },
                        1500
                    );

                }

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