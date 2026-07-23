const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


module.exports = {

    name: "setupmusicpanel",


    async execute(message) {


        const embed = new EmbedBuilder()

        .setColor("#00FFFF")

        .setTitle("🎵 Freedx MC • Sistema de Música")

        .setDescription(
`
Clique no botão abaixo para abrir o painel de música.

🎧 Controle suas músicas
🔎 Pesquise pelo painel
🎚️ Controle volume
`
        )

        .setFooter({
            text:"Freedx MC Music System"
        });



        const button =
        new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()

            .setCustomId("open_musicpanel")

            .setLabel("🎵 Abrir Painel")

            .setStyle(ButtonStyle.Primary)

        );



        message.channel.send({

            embeds:[embed],

            components:[button]

        });


    }

};