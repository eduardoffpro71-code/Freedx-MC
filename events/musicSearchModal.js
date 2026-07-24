const {
    MessageFlags
} = require("discord.js");


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

    name:"interactionCreate",

    once:false,


    async execute(interaction){


        if(!interaction.isModalSubmit())
            return;



        if(interaction.customId !== "music_search_modal")
            return;



        if(
            interaction.replied ||
            interaction.deferred
        ){
            return;
        }



        try{


            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            });




            const query =
            interaction.fields.getTextInputValue(
                "music_query"
            );



            const voice =
            interaction.member.voice.channel;



            if(!voice){

                return interaction.editReply(
                    "🎤 Entre em um canal de voz primeiro."
                );

            }




            const search =
            await yts(query);



            if(
                !search ||
                !search.videos ||
                search.videos.length === 0
            ){

                return interaction.editReply(
                    "❌ Música não encontrada."
                );

            }




            const video =
            search.videos[0];





            const song = {


                title:
                video.title,


                url:
                video.url,


                id:
                video.videoId,


                thumbnail:
                video.thumbnail || null,


                duration:
                video.timestamp || "0:00",


                requestedBy:
                interaction.user.username


            };







            let serverQueue =
            queues.getQueue(
                interaction.guild.id
            );







            if(serverQueue){

                if(
                    serverQueue.voiceChannel &&
                    serverQueue.voiceChannel.id !== voice.id
                ){

                    return interaction.editReply(
                        "❌ Estou tocando em outro canal."
                    );

                }

            }







            if(!serverQueue){



                const player =
                createAudioPlayer();




                const connection =
                joinVoiceChannel({


                    channelId:
                    voice.id,


                    guildId:
                    interaction.guild.id,


                    adapterCreator:
                    interaction.guild.voiceAdapterCreator,


                    selfDeaf:true


                });




                connection.subscribe(
                    player
                );







                serverQueue =
                queues.createQueue(

                    interaction.guild.id,

                    {

                        voiceChannel: voice,

                        textChannel:
                        interaction.channel,

                        connection,

                        player

                    }

                );





                console.log(
                    "🔊 Entrou na call:",
                    voice.name
                );


            }







            serverQueue.songs.push(
                song
            );








            if(!serverQueue.playing){


                await playSong(

                    interaction.guild,

                    serverQueue

                );


            }







            return interaction.editReply(

                `🎵 Adicionado: **${song.title}**`

            );





        }catch(error){


            console.log(
                "❌ Erro pesquisa:",
                error.message
            );



            if(
                interaction.deferred ||
                interaction.replied
            ){

                return interaction.editReply(
                    "❌ Erro ao pesquisar música."
                );

            }


        }


    }

};