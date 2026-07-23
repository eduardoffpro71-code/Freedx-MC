const fs = require("fs");
const https = require("https");

const file = "./yt-dlp";

const url =
"https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";


function baixar(urlAtual, primeira = true){

    return new Promise((resolve, reject)=>{


        if(primeira){

            console.log(
                "⬇️ Baixando yt-dlp atualizado..."
            );

        }



        https.get(urlAtual, res=>{


            // segue redirect do GitHub
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
                                "✅ yt-dlp atualizado e pronto!"
                            );


                            resolve();


                        }catch(error){


                            reject(error);


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
.catch(err=>{

    console.log(
        "❌ Erro yt-dlp:",
        err.message
    );

});