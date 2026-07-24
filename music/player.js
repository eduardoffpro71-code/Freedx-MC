const {
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require("@discordjs/voice");

const {
    spawn
} = require("child_process");

const path = require("path");
const fs = require("fs");

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


        // ==========================
        // YOUTUBE STREAM
        // ==========================

        if(
            song.url.includes("youtube.com") ||
            song.url.includes("youtu.be")
        ){

 const ytDlp = process.platform === "win32"
    ? path.join(process.cwd(), "yt-dlp.exe")
    : path.join(process.cwd(), "yt-dlp");


const cookies = path.join(
    process.cwd(),
    "cookies.txt"
);


console.log(
    "🍪 Cookies existe:",
    fs.existsSync(cookies)
);

console.log("🚀 PLAYER NOVO SEM -f");


const yt = spawn(
    ytDlp,
    [
        "-g",

        "--no-playlist",

        "--no-warnings",

        "--force-ipv4",

        "--cookies",
        cookies,

        song.url
    ]
);


            queue.ytProcess = yt;


            let output = "";



            await new Promise((resolve,reject)=>{


                yt.stdout.on(
                    "data",
                    data=>{

                        output += data.toString();

                    }
                );


                yt.stderr.on(
                    "data",
                    data=>{

                        console.log(
                            "yt-dlp:",
                            data.toString()
                        );

                    }
                );


                yt.on(
                    "close",
                    code=>{

                        if(code !== 0){

                            reject(
                                new Error(
                                    "yt-dlp falhou"
                                )
                            );

                        }else{

                            resolve();

                        }

                    }
                );


                yt.on(
                    "error",
                    reject
                );


            });



            if(!output.trim()){

                throw new Error(
                    "Stream vazio"
                );

            }


            input = output.trim();


        }else{


            input = song.url;


        }




        // ==========================
        // FFMPEG
        // ==========================


        const ff = spawn(
            ffmpeg,
            [

                "-i",
                input,

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



        const resource = createAudioResource(
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



        if(!queue.connection){

            throw new Error(
                "Sem conexão de voz"
            );

        }


        queue.connection.subscribe(
            queue.player
        );



        queue.player.removeAllListeners(
            AudioPlayerStatus.Idle
        );


        queue.player.removeAllListeners(
            "error"
        );



        queue.player.once(
            AudioPlayerStatus.Idle,
            ()=>{

                console.log(
                    "⏹️ Música finalizada"
                );


                queue.songs.shift();

                queue.current = null;
                queue.playing = false;


                playSong(
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


                queue.songs.shift();

                queue.current = null;
                queue.playing = false;


                playSong(
                    guild,
                    queue
                );

            }
        );



        console.log(
            "▶️ Iniciando áudio..."
        );


        queue.player.play(
            resource
        );



    }catch(error){


        console.log(
            "❌ Erro player:",
            error.message
        );


        queue.playing = false;


        if(queue.songs.length){

            queue.songs.shift();

        }

    }

}



module.exports = {
    playSong
};