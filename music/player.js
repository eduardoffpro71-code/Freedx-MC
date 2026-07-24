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



async function playSong(guild, queue){


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



    try{


        let input;



        // =====================
        // YOUTUBE STREAM
        // =====================

        if(
            song.url.includes("youtube.com") ||
            song.url.includes("youtu.be")
        ){


            const ytDlp =
            path.join(
                process.cwd(),
                "yt-dlp"
            );



            const yt = spawn(

                ytDlp,

                [

                    "-g",

                    "-f",
                    "bestaudio/best",

                    "--no-playlist",

                    "--no-warnings",

                    "--extractor-args",
                    "youtube:player_client=android",

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



            let url = "";



            yt.stdout.on(
                "data",
                data=>{

                    url += data.toString();

                }
            );



            await new Promise(resolve=>{

                yt.stdout.on(
                    "end",
                    resolve
                );

            });



            if(!url){

                throw new Error(
                    "Não conseguiu pegar stream do YouTube"
                );

            }



            input = url.trim();


        }else{


            // =====================
            // LINK DIRETO
            // =====================


            input = song.url;


        }





        const ff = spawn(

            ffmpeg,

            [

                "-i",

                input,


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

            error=>{


                console.log(
                    "❌ Player:",
                    error.message
                );


                queue.songs.shift();

                queue.playing = false;



                playSong(
                    guild,
                    queue
                );


            }

        );




    }catch(error){


        console.log(
            "❌ Erro player:",
            error.message
        );


        queue.playing = false;


        queue.songs.shift();


    }


}



module.exports = {

    playSong

};