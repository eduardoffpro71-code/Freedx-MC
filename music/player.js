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



        /*
        =====================
        YOUTUBE
        =====================
        */


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

                    "-f",
                    "bestaudio",

                    "--no-playlist",

                    "--no-warnings",

                    "--quiet",

                    "--extractor-args",
                    "youtube:player_client=android",

                    "-N",
                    "4",

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



            input = yt.stdout;


        }else{


            /*
            =====================
            LINK DIRETO
            =====================
            */


            input = song.url;


        }





        let audioStream;



        /*
        =====================
        FFMPEG
        =====================
        */


        const ff =
        spawn(

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




        if(
            typeof input === "string"
        ){

            const direct =
            spawn(

                ffmpeg,

                [

                    "-i",
                    input,

                    "-f",
                    "s16le",

                    "-ar",
                    "48000",

                    "-ac",
                    "2",

                    "pipe:1"

                ]

            );


            queue.ffmpegProcess =
            direct;


            audioStream =
            direct.stdout;


        }
        else{


            input.pipe(
                ff.stdin
            );


            audioStream =
            ff.stdout;

        }







        const resource =
        createAudioResource(

            audioStream,

            {

                inputType:
                StreamType.Raw,

                inlineVolume:true

            }

        );




        queue.resource =
        resource;



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


    }


}



module.exports = {

    playSong

};