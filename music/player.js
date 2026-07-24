const {
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require("@discordjs/voice");


const {
    spawn
} = require("child_process");


const path = require("path");

const ffmpeg = require("ffmpeg-static");





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
            "yt-dlp"
        );





        const yt = spawn(

            ytDlp,

            [

                "-f",
                "bestaudio/best",

                "--no-playlist",

                "--force-ipv4",

                "--extractor-args",
                "youtube:player_client=android,web",

                "--extractor-args",
                "youtube:skip=dash",

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





        yt.stderr.on(
            "data",
            data=>{


                const msg =
                data.toString();


                if(
                    !msg.includes("WARNING")
                ){

                    console.log(
                        "yt-dlp:",
                        msg.trim()
                    );

                }


            }
        );







        yt.on(
            "error",
            error=>{


                console.log(
                    "❌ yt-dlp:",
                    error.message
                );


                nextSong(
                    guild,
                    queue
                );


            }
        );







        const ff = spawn(

            ffmpeg,

            [

                "-i",
                "pipe:0",

                "-analyzeduration",
                "0",

                "-loglevel",
                "error",

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





        if(queue.volume){

            resource.volume.setVolume(
                queue.volume / 100
            );

        }







        queue.player.play(
            resource
        );







        queue.player.once(

            AudioPlayerStatus.Idle,

            ()=>{


                nextSong(
                    guild,
                    queue
                );


            }

        );






        queue.player.once(

            "error",

            error=>{


                console.log(
                    "❌ Player:",
                    error.message
                );


                nextSong(
                    guild,
                    queue
                );


            }

        );





    }catch(error){


        console.log(
            "❌ Erro:",
            error.message
        );


        nextSong(
            guild,
            queue
        );


    }


}





function nextSong(guild, queue){


    if(queue.ytProcess){

        queue.ytProcess.kill();

    }


    if(queue.ffmpegProcess){

        queue.ffmpegProcess.kill();

    }




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





module.exports = {

    playSong

};