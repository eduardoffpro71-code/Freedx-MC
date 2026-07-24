const {
    joinVoiceChannel
} = require("@discordjs/voice");


const yts = require("yt-search");

const queues = require("../music/queue");

const {
    playSong
} = require("../music/player");



module.exports = {

    name: "play",



    async execute(message, args) {


        const voice = message.member.voice.channel;



        if(!voice){

            return message.reply(
                "🎤 Entre em um canal de voz primeiro!"
            );

        }



        const query = args.join(" ");



        if(!query){

            return message.reply(
                "🎵 Envie nome da música ou link!"
            );

        }



        const loading = await message.reply(
            "🔎 Procurando música..."
        );



        let song;



        try {



            if(query.startsWith("http")){


                song = {

                    title: query,

                    url: query,

                    source: "direct",

                    requestedBy:
                    message.author.username

                };



            }else{


                const search =
                await yts(query);



                if(
                    !search.videos ||
                    search.videos.length === 0
                ){

                    return loading.edit(
                        "❌ Música não encontrada."
                    );

                }



                const video =
                search.videos[0];



                song = {

                    title:
                    video.title,


                    url:
                    video.url,


                    id:
                    video.videoId,


                    thumbnail:
                    video.thumbnail,


                    duration:
                    video.timestamp,


                    source:
                    "youtube",


                    requestedBy:
                    message.author.username

                };


            }



        }catch(error){


            console.log(
                "❌ Erro busca:",
                error.message
            );


            return loading.edit(
                "❌ Erro ao procurar música."
            );


        }






        let serverQueue =
        queues.getQueue(
            message.guild.id
        );






        if(
            serverQueue &&
            serverQueue.voiceChannel &&
            serverQueue.voiceChannel.id !== voice.id
        ){

            return loading.edit(
                "❌ Estou tocando em outro canal."
            );

        }







        if(!serverQueue){



            const connection =
            joinVoiceChannel({


                channelId:
                voice.id,


                guildId:
                message.guild.id,


                adapterCreator:
                message.guild.voiceAdapterCreator,


                selfDeaf:true


            });





            serverQueue =
            queues.createQueue(

                message.guild.id,

                {

                    voiceChannel:
                    voice,


                    textChannel:
                    message.channel,


                    connection,


                    volume:100

                }

            );





            connection.subscribe(
                serverQueue.player
            );





            console.log(
                `🔊 Entrou na call: ${voice.name}`
            );


        }







        serverQueue.songs.push(
            song
        );







        await loading.edit(

            `🎵 Adicionado: **${song.title}**`

        );







        if(!serverQueue.playing){


            playSong(

                message.guild,

                serverQueue

            );


        }




    }


};