const { MessageFlags } = require("discord.js");
const queues = require("../music/queue");


module.exports = {

    name: "interactionCreate",
    once: false,


    async execute(interaction) {


        if (!interaction.isButton())
            return;



        const botoesPainel = [

            "music_play",
            "music_pause",
            "music_next",
            "music_skip",
            "music_stop",
            "volume_up",
            "volume_down",
            "music_loop",
            "music_queue",
            "music_shuffle"

        ];



        if (!botoesPainel.includes(interaction.customId))
            return;




        // proteção contra resposta duplicada
        if(
            interaction.replied ||
            interaction.deferred
        ){

            console.log(
                "⚠️ Botão já respondido"
            );

            return;

        }




        try {


            await interaction.deferReply({
                flags: MessageFlags.Ephemeral
            });


        } catch(error) {


            console.log(
                "❌ Erro deferReply:",
                error.message
            );

            return;

        }







        const serverQueue =
        queues.getQueue(
            interaction.guild.id
        );





        if (!serverQueue) {

            return interaction.editReply(
                "🎵 Nenhuma música tocando."
            );

        }







        switch(interaction.customId) {



            case "music_play":

                if(serverQueue.player){

                    serverQueue.player.unpause();

                }

                serverQueue.paused = false;


                return interaction.editReply(
                    "▶️ Música retomada."
                );







            case "music_pause":

                if(serverQueue.player){

                    serverQueue.player.pause();

                }

                serverQueue.paused = true;


                return interaction.editReply(
                    "⏸️ Música pausada."
                );







            case "music_next":
            case "music_skip":

                serverQueue.playing = false;


                if(serverQueue.player){

                    serverQueue.player.stop();

                }


                return interaction.editReply(
                    "⏭️ Próxima música."
                );







            case "music_stop":


                serverQueue.songs = [];

                serverQueue.current = null;

                serverQueue.startedAt = null;

                serverQueue.duration = 0;

                serverQueue.playing = false;


                if(serverQueue.player){

                    serverQueue.player.stop();

                }


                return interaction.editReply(
                    "⏹️ Música parada."
                );







            case "volume_up":


                serverQueue.volume =
                Math.min(
                    100,
                    serverQueue.volume + 10
                );


                if(serverQueue.resource?.volume){

                    serverQueue.resource.volume.setVolume(
                        serverQueue.volume / 100
                    );

                }


                return interaction.editReply(
                    `🔊 Volume ${serverQueue.volume}%`
                );







            case "volume_down":


                serverQueue.volume =
                Math.max(
                    0,
                    serverQueue.volume - 10
                );


                if(serverQueue.resource?.volume){

                    serverQueue.resource.volume.setVolume(
                        serverQueue.volume / 100
                    );

                }


                return interaction.editReply(
                    `🔉 Volume ${serverQueue.volume}%`
                );







            case "music_loop":


                serverQueue.loop =
                !serverQueue.loop;


                return interaction.editReply(
                    `🔁 Loop ${
                        serverQueue.loop
                        ? "ativado"
                        : "desativado"
                    }`
                );







            case "music_queue":


                const fila =
                serverQueue.songs
                .slice(0,10)
                .map(
                    (song,i)=>
                    `${i+1}. ${song.title}`
                )
                .join("\n");


                return interaction.editReply(
                    `📜 Fila:\n${fila || "vazia"}`
                );







            case "music_shuffle":


                serverQueue.songs.sort(
                    () => Math.random() - 0.5
                );


                return interaction.editReply(
                    "🔀 Fila embaralhada."
                );


        }


    }


};