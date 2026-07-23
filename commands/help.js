const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");

module.exports = {

    name: "help",

    async execute(message) {

        const logo = new AttachmentBuilder(
            path.join(__dirname, "../images/freedx-logo.png")
        );

        const embed = new EmbedBuilder()

            .setColor("#00FFFF")

            .setTitle("🎧 Freedx MC • Central de Ajuda")

            .setDescription(`
Bem-vindo ao **Freedx MC**.

Escolha uma categoria abaixo:

🎶 Música
⚙️ Sistema
👑 Criador
🎛️ Painel
🔎 Pesquisar Música
`)

            .setThumbnail("attachment://freedx-logo.png")

            .setFooter({
                text: "Freedx MC Music System"
            })

            .setTimestamp();

        const row = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("help_music")
                    .setLabel("🎶 Música")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("help_system")
                    .setLabel("⚙️ Sistema")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("help_creator")
                    .setLabel("👑 Criador")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("open_musicpanel")
                    .setLabel("🎛️ Painel")
                    .setStyle(ButtonStyle.Danger)

            );

        const row2 = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("music_search")
                    .setLabel("🔎 Pesquisar Música")
                    .setStyle(ButtonStyle.Primary)

            );

        await message.channel.send({

            embeds: [embed],

            files: [logo],

            components: [
                row,
                row2
            ]

        });

    }

};