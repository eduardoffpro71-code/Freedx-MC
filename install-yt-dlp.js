const fs = require("fs");
const https = require("https");

const file = "./yt-dlp";

const url =
"https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux";


function baixar(){

    return new Promise((resolve, reject)=>{


        console.log("⬇️ Baixando yt-dlp atualizado...");


        const out = fs.createWriteStream(file);



        https.get(url, res=>{


            if(res.statusCode !== 200){

                reject(
                    new Error(
                        "Erro download HTTP: " + res.statusCode
                    )
                );

                return;

            }



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


                        }catch(err){

                            reject(err);

                        }


                    });


                }
            );



        }).on(
            "error",
            err=>{

                reject(err);

            }
        );


    });

}



baixar()

.catch(err=>{

    console.log(
        "❌ Erro yt-dlp:",
        err.message
    );

});