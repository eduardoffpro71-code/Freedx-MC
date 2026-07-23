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



    queue.guildId = guild.id;
    queue.playing = true;



    console.log(
        `🎵 Tocando: ${song.title}`
    );



    try{


        const yt =
        ytDlp.execStream([

            song.url,

            "-f",
            "bestaudio/best",

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





        if(!queue.player){

            console.log(
                "❌ Player não existe"
            );

            queue.playing=false;
            return;

        }




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
            async ()=>{


                console.log(
                    "⏹️ Música terminou"
                );


                queue.playing=false;


                queue.songs.shift();


                queue.current=null;

                queue.startedAt=null;

                queue.duration=0;



                if(queue.songs.length > 0){

                    await playSong(
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
                    "❌ YTDLP:",
                    err.message
                );

                queue.playing=false;

            }
        );




        ffmpeg.on(
            "error",
            err=>{

                console.log(
                    "❌ FFMPEG:",
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