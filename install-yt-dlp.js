const fs = require("fs");
const https = require("https");

const file = "yt-dlp";

const url =
"https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";


function download(){

    console.log("⬇️ Baixando yt-dlp atualizado...");


    const stream = fs.createWriteStream(file);


    https.get(url, response => {


        response.pipe(stream);


        stream.on("finish", ()=>{

            stream.close(()=>{


                try {

                    fs.chmodSync(
                        file,
                        0o755
                    );

                    console.log(
                        "✅ yt-dlp atualizado e pronto!"
                    );


                } catch(err){

                    console.log(
                        "❌ Erro permissão:",
                        err.message
                    );

                }


            });


        });


    }).on(
        "error",
        err=>{

            console.log(
                "❌ Erro download yt-dlp:",
                err.message
            );

        }
    );

}



if(!fs.existsSync(file)){

    download();

}else{

    fs.chmodSync(
        file,
        0o755
    );

    console.log(
        "✅ yt-dlp já existe"
    );

}