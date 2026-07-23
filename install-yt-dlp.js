const fs = require("fs");
const https = require("https");

const file = "./yt-dlp";

const url =
"https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";


function baixar(){

    console.log("⬇️ Baixando yt-dlp atualizado...");


    const out = fs.createWriteStream(file);


    https.get(url, res=>{

        res.pipe(out);


        out.on("finish",()=>{

            out.close(()=>{

                fs.chmodSync(
                    file,
                    0o755
                );


                console.log(
                    "✅ yt-dlp atualizado e pronto!"
                );

            });

        });


    }).on("error",err=>{

        console.log(
            "❌ Erro download:",
            err.message
        );

    });

}



baixar();