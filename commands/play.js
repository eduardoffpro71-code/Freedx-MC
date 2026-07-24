const {
    joinVoiceChannel,
    createAudioPlayer
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
                "🎵 Digite o nome da música ou link!"
            );

        }



        const loading = await message.reply(
            "🔎 Procurando música..."
        );



        let video;



        try{


            const search = await yts(query);



            if(!search || !search.videos.length){


                return loading.edit(
                    "❌ Música não encontrada."
                );

            }



            video = search.videos[0];



        }catch(error){


            console.log(
                "❌ Erro pesquisa:",
                error.message
            );


            return loading.edit(
                "❌ Erro ao procurar música."
            );

        }








        const song = {


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


            requestedBy:
            message.author.username


        };









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
                "❌ Já estou tocando em outro canal."
            );


        }










        if(!serverQueue){



            const player =
            createAudioPlayer();





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





            connection.subscribe(
                player
            );







            serverQueue =
            queues.createQueue(

                message.guild.id,

                {

                    voiceChannel: voice,

                    textChannel:
                    message.channel,

                    connection,

                    player

                }

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