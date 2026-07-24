const {
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require("@discordjs/voice");


const { spawn } = require("child_process");
const path = require("path");

const ffmpeg = require("ffmpeg-static");

const queues = require("./queue");



async function playSong(guild, queue) {


    if(!queue){
        console.log("❌ Queue não encontrada");
        return;
    }



    if(queue.songs.length === 0){


        queue.playing = false;
        queue.current = null;

        return;

    }





    const song = queue.songs[0];


    queue.current = song;
    queue.playing = true;



    console.log(
        "🎵 Tocando:",
        song.title
    );






    try {



        const ytDlp = path.join(
            process.cwd(),
            "yt-dlp.exe"
        );



        const yt = spawn(
            ytDlp,
            [
                "-f",
                "bestaudio",
                "-o",
                "-",
                song.url
            ],
            {
                stdio:[
                    "ignore",
                    "pipe",
                    "pipe"
                ]
            }
        );



        queue.ytProcess = yt;





        const ff = spawn(
            ffmpeg,
            [
                "-i",
                "pipe:0",

                "-analyzeduration",
                "0",

                "-loglevel",
                "0",

                "-f",
                "s16le",

                "-ar",
                "48000",

                "-ac",
                "2",

                "pipe:1"
            ]
        );



        queue.ffmpegProcess = ff;



        yt.stdout.pipe(
            ff.stdin
        );







        const resource =
        createAudioResource(

            ff.stdout,

            {
                inputType:
                StreamType.Raw,

                inlineVolume:true

            }

        );





        queue.resource = resource;



        resource.volume.setVolume(
            queue.volume / 100
        );





        queue.player.play(
            resource
        );






        queue.player.once(

            AudioPlayerStatus.Idle,

            () => {


                queue.songs.shift();



                queue.current = null;



                queue.playing = false;



                queue.ytProcess = null;

                queue.ffmpegProcess = null;




                playSong(
                    guild,
                    queue
                );


            }

        );





        queue.player.on(
            "error",
            error => {


                console.log(
                    "❌ Erro player:",
                    error.message
                );


                queue.playing = false;


                queue.songs.shift();


                playSong(
                    guild,
                    queue
                );


            }
        );





    } catch(error){



        console.log(
            "❌ Erro ao tocar:",
            error
        );



        queue.playing = false;



    }



}




module.exports = {

    playSong

};