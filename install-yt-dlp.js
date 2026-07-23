const fs = require("fs");
const https = require("https");
const path = require("path");

const file = path.join(
    process.cwd(),
    "yt-dlp"
);

const url =
"https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";


// verifica se já existe
if (fs.existsSync(file)) {

    try {

        fs.chmodSync(
            file,
            0o755
        );

        console.log(
            "✅ yt-dlp já existe!"
        );

        console.log(
            "🚀 Continuando inicialização do bot..."
        );

        process.exit(0);

    } catch(err) {

        console.log(
            "⚠️ Erro verificando yt-dlp:",
            err.message
        );

    }

}



function baixar(urlAtual, primeira = true){

    return new Promise((resolve, reject)=>{


        if(primeira){

            console.log(
                "⬇️ Baixando yt-dlp..."
            );

        }



        https.get(urlAtual, res=>{


            if(
                res.statusCode >= 300 &&
                res.statusCode < 400 &&
                res.headers.location
            ){

                return baixar(
                    res.headers.location,
                    false
                )
                .then(resolve)
                .catch(reject);

            }



            if(res.statusCode !== 200){

                return reject(
                    new Error(
                        "HTTP " + res.statusCode
                    )
                );

            }



            const out =
            fs.createWriteStream(file);



            res.pipe(out);



            out.on(
                "finish",
                ()=>{

                    out.close(()=>{


                        try{


                            fs.chmodSync(
                                file,
                                0o755
                            );


                            console.log(
                                "✅ yt-dlp pronto!"
                            );


                            resolve();


                        }catch(err){

                            reject(err);

                        }


                    });


                }
            );


        })
        .on(
            "error",
            reject
        );


    });

}



baixar(url)
.then(()=>{

    console.log(
        "🚀 Continuando inicialização do bot..."
    );

})
.catch(err=>{


    console.error(
        "❌ Erro ao instalar yt-dlp:",
        err.message
    );


    process.exit(1);


});