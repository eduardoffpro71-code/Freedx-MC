const {
    createAudioResource,
    AudioPlayerStatus,
    StreamType
} = require("@discordjs/voice");

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ffmpegPath = require("ffmpeg-static");

const YTDlpWrap = require("yt-dlp-wrap").default;

const queues = require("./queue");



// caminho yt-dlp Railway / local
let ytDlpPath = "yt-dlp";

const localYt = path.join(
    __dirname,
    "..",
    "yt-dlp"
);


if(fs.existsSync(localYt)){
    ytDlpPath = localYt;
}


const ytDlp = new YTDlpWrap(ytDlpPath);




function durationToSeconds(duration){

    if(!duration)
        return 0;


    const p = duration.split(":").map(Number);


    if(p.length === 2)
        return p[0] * 60 + p[1];


    if(p.length === 3)
        return (
            p[0] * 3600 +
            p[1] * 60 +
            p[2]
        );


    return 0;
}





async function playSong(guild, song){


    const queue =
    queues.getQueue(guild.id);



    if(!queue)
        return;



    if(queue.playing)
        return;



    queue.playing = true;


    console.log(
        `🎵 Tocando: ${song.title}`
    );



    try{


        const yt =
        ytDlp.execStream([

            song.url,

            "-f",
            "bestaudio",

            "--no-playlist",

            "--quiet"

        ]);




        const ffmpeg =
        spawn(

            ffmpegPath,

            [

                "-i",
                "pipe:0",

                "-vn",

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




        queue.ytProcess = yt;

        queue.ffmpegProcess = ffmpeg;




        yt.pipe(
            ffmpeg.stdin
        );




        const resource =
        createAudioResource(

            ffmpeg.stdout,

            {

                inputType:
                StreamType.Raw,

                inlineVolume:true

            }

        );




        queue.resource = resource;

        queue.current = song;



        if(resource.volume){

            resource.volume.setVolume(
                queue.volume / 100
            );

        }




        queue.player.play(
            resource
        );






        queue.player.once(

            AudioPlayerStatus.Playing,

            ()=>{

                console.log(
                    "▶️ Música começou!"
                );


                queue.startedAt =
                Date.now();

            }

        );






        queue.player.once(

            AudioPlayerStatus.Idle,

            ()=>{


                console.log(
                    "⏹️ Música terminou"
                );


                queue.playing=false;


                queue.songs.shift();


                queue.current=null;




                if(queue.songs.length){

                    playSong(
                        guild,
                        queue.songs[0]
                    );

                }


            }

        );






        yt.on(

            "error",

            err=>{


                console.log(
                    "❌ yt-dlp:",
                    err.message
                );


                queue.playing=false;


            }

        );





        ffmpeg.on(

            "error",

            err=>{


                console.log(
                    "❌ ffmpeg:",
                    err.message
                );


                queue.playing=false;


            }

        );





    }catch(error){


        console.log(
            "❌ Erro player:",
            error.message
        );


        queue.playing=false;


    }


}





module.exports = {

    playSong,

    durationToSeconds

};