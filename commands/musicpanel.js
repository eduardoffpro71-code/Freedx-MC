const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const queues = require("../music/queue");


module.exports = {

    name: "musicpanel",


    async execute(message) {


        const serverQueue = queues.getQueue(
            message.guild.id
        );


        const embed = new EmbedBuilder()

            .setColor("#00FFFF")

            .setTitle(
                "🎵 Freedx MC • Painel de Música"
            )

            .setDescription(
                "🎶 Nenhuma música tocando."
            )

            .setFooter({
                text: "Freedx MC • Music System 🎧"
            })

            .setTimestamp();



        if (
            serverQueue &&
            serverQueue.current
        ) {


            embed.setDescription(

                `🎶 **${serverQueue.current.title}**\n\n` +

                `👤 Pedido por: **${serverQueue.current.requestedBy}**\n` +

                `🔊 Volume: **${serverQueue.volume}%**\n` +

                `🔁 Loop: **${
                    serverQueue.loop
                    ? "Ativado"
                    : "Desativado"
                }**`

            );


            if(serverQueue.current.thumbnail){

                embed.setThumbnail(
                    serverQueue.current.thumbnail
                );

            }

        }




        // CONTROLE PRINCIPAL

        const row1 = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()
                .setCustomId("music_previous")
                .setEmoji("⏮️")
                .setStyle(ButtonStyle.Secondary),


            new ButtonBuilder()
                .setCustomId("music_back")
                .setEmoji("⏪")
                .setStyle(ButtonStyle.Secondary),


            new ButtonBuilder()
                .setCustomId("music_play")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Success),


            new ButtonBuilder()
                .setCustomId("music_pause")
                .setEmoji("⏸️")
                .setStyle(ButtonStyle.Primary),


            new ButtonBuilder()
                .setCustomId("music_next")
                .setEmoji("⏭️")
                .setStyle(ButtonStyle.Secondary)

        );





        // CONTROLE EXTRA

        const row2 = new ActionRowBuilder()

        .addComponents(

            new ButtonBuilder()
                .setCustomId("music_forward")
                .setEmoji("⏩")
                .setStyle(ButtonStyle.Secondary),


            new ButtonBuilder()
                .setCustomId("music_stop")
                .setEmoji("⏹️")
                .setStyle(ButtonStyle.Danger),


            new ButtonBuilder()
                .setCustomId("volume_down")
                .setEmoji("🔉")
                .setStyle(ButtonStyle.Secondary),


            new ButtonBuilder()
                .setCustomId("volume_up")
                .setEmoji("🔊")
                .setStyle(ButtonStyle.Secondary),


            new ButtonBuilder()
                .setCustomId("music_loop")
                .setEmoji("🔁")
                .setStyle(ButtonStyle.Success)

        );





        // SISTEMAS

        const row3 = new ActionRowBuilder()

        .addComponents(


            new ButtonBuilder()
                .setCustomId("music_queue")
                .setLabel("📜 Fila")
                .setStyle(ButtonStyle.Primary),



            new ButtonBuilder()
                .setCustomId("music_shuffle")
                .setLabel("🔀 Shuffle")
                .setStyle(ButtonStyle.Success),



            new ButtonBuilder()
                .setCustomId("music_search")
                .setLabel("🔎 Pesquisar")
                .setStyle(ButtonStyle.Primary)

        );





        const panel = await message.channel.send({

            embeds:[
                embed
            ],

            components:[

                row1,
                row2,
                row3

            ]

        });





        if(serverQueue){

            serverQueue.panelMessage = panel;

        }



        message.delete()
        .catch(()=>{});

    }

};