const {
    createAudioResource,
    AudioPlayerStatus,
    StreamType
} = require("@discordjs/voice");

const { spawn } = require("child_process");

const ffmpegPath = require("ffmpeg-static");

const YTDlpWrap = require("yt-dlp-wrap").default;
const ytDlp = new YTDlpWrap();

const queues = require("./queue");


function durationToSeconds(duration){

    if(!duration)
        return 0;


    const parts = duration.split(":").map(Number);


    if(parts.length === 2)
        return parts[0] * 60 + parts[1];


    if(parts.length === 3)
        return parts[0] * 3600 + parts[1] * 60 + parts[2];


    return 0;
}



async function playSong(guild,song){


    const queue =
    queues.getQueue(guild.id);


    if(!queue)
        return;


    if(queue.playing)
        return;



    queue.guildId = guild.id;

    queue.playing = true;


    console.log(
        "🎵 Tocando:",
        song.title
    );



    let yt;


    try{


        yt =
        ytDlp.execStream([

            song.url,

            "-f",
            "bestaudio",

            "--no-playlist",

            "-o",
            "-"

        ]);


    }catch(err){

        console.log(
            "❌ yt-dlp:",
            err.message
        );

        queue.playing=false;
        return;

    }



    const ffmpeg =
    spawn(
        ffmpegPath,
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



    yt.pipe(
        ffmpeg.stdin
    );



    queue.ytProcess = yt;
    queue.ffmpegProcess = ffmpeg;



    ffmpeg.stderr.on(
        "data",
        data=>{

            console.log(
                "FFMPEG:",
                data.toString()
            );

        }
    );




    const resource =
    createAudioResource(
        ffmpeg.stdout,
        {
            inputType: StreamType.Raw,
            inlineVolume:true
        }
    );



    if(resource.volume){

        resource.volume.setVolume(
            queue.volume / 100
        );

    }




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
        async()=>{


            console.log(
                "⏹️ Música terminou"
            );


            queue.playing=false;


            queue.songs.shift();


            queue.current=null;

            queue.startedAt=null;


            try{

                yt.destroy();

                ffmpeg.kill();

            }catch{}



            if(queue.songs.length){

                playSong(
                    guild,
                    queue.songs[0]
                );

            }


        }
    );




    queue.player.on(
        "error",
        err=>{

            console.log(
                "❌ Player:",
                err.message
            );

            queue.playing=false;

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
                "❌ FFmpeg:",
                err.message
            );

            queue.playing=false;

        }
    );

}



module.exports={

    playSong,

    durationToSeconds

};