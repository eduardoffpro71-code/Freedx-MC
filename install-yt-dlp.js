const fs = require("fs");
const https = require("https");
const path = require("path");
const { execSync } = require("child_process");


const file = path.join(
    process.cwd(),
    "yt-dlp"
);


function download(url){

    return new Promise((resolve,reject)=>{

        const out = fs.createWriteStream(file);


        https.get(url,(res)=>{

            res.pipe(out);


            out.on("finish",()=>{

                out.close();

                fs.chmodSync(
                    file,
                    0o755
                );

                resolve();

            });


        }).on("error",reject);

    });

}



(async()=>{

    try{

        if(fs.existsSync(file)){

            console.log(
                "✅ yt-dlp já existe!"
            );

            process.exit();

        }


        console.log(
            "⬇️ Baixando yt-dlp standalone..."
        );


        await download(
            "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux"
        );


        console.log(
            "✅ yt-dlp standalone pronto!"
        );


    }catch(err){

        console.log(
            "❌ Erro baixando yt-dlp:",
            err.message
        );

    }


})();