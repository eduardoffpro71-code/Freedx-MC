const {
    MessageFlags
} = require("discord.js");


const {
    joinVoiceChannel,
    createAudioPlayer
} = require("@discordjs/voice");


const play = require("play-dl");


const queues = require("../music/queue");
const { playSong } = require("../music/player");



module.exports = {

    name:"interactionCreate",

    once:false,


    async execute(interaction){


        if(!interaction.isModalSubmit())
            return;



        if(interaction.customId !== "music_search_modal")
            return;



        // evita responder o mesmo modal duas vezes
        if(
            interaction.replied ||
            interaction.deferred
        ){

            console.log(
                "⚠️ Modal já respondido"
            );

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



            const result =
            await play.search(query,{
                limit:1
            });



            if(
                !result ||
                result.length === 0
            ){

                return interaction.editReply(
                    "❌ Música não encontrada."
                );

            }



            const song = {

                title: result[0].title,

                url:
                `https://www.youtube.com/watch?v=${result[0].id}`,

                thumbnail:
                result[0].thumbnails?.[0]?.url || null,

                duration:
                result[0].durationRaw || "0:00",

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
                        "❌ Estou tocando em outro canal de voz."
                    );

                }

            }



            if(!serverQueue){


                const player =
                createAudioPlayer();



                const connection =
                joinVoiceChannel({

                    channelId: voice.id,

                    guildId:
                    interaction.guild.id,

                    adapterCreator:
                    interaction.guild.voiceAdapterCreator,

                    selfDeaf:true

                });



                connection.subscribe(player);



                serverQueue =
                queues.createQueue(

                    interaction.guild.id,

                    {

                        guildId:
                        interaction.guild.id,

                        voiceChannel:
                        voice,

                        textChannel:
                        interaction.channel,

                        connection,

                        player,

                        songs:[],

                        volume:50,

                        loop:false,

                        playing:false,

                        current:null,

                        startedAt:null,

                        duration:0

                    }

                );


                console.log(
                    "🔊 Entrou na call:",
                    voice.name
                );


            }



            serverQueue.songs.push(song);



            if(!serverQueue.current){


                await playSong(
                    interaction.guild,
                    song
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