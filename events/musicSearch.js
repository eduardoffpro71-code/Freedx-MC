const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");


module.exports = {

    name: "interactionCreate",

    once: false,


    async execute(interaction) {


        // somente botão
        if (!interaction.isButton())
            return;



        // botão de pesquisa
        if (interaction.customId !== "music_search")
            return;




        try {


            const modal = new ModalBuilder()

                .setCustomId(
                    "music_search_modal"
                )

                .setTitle(
                    "🎵 Pesquisar Música"
                );






            const musicInput =
            new TextInputBuilder()

                .setCustomId(
                    "music_query"
                )

                .setLabel(
                    "Nome ou link da música"
                )

                .setPlaceholder(
                    "Ex: Matuê, Phonk, YouTube..."
                )

                .setRequired(true)

                .setStyle(
                    TextInputStyle.Short
                );







            const row =
            new ActionRowBuilder()
                .addComponents(
                    musicInput
                );






            modal.addComponents(
                row
            );






            await interaction.showModal(
                modal
            );





        } catch(error) {


            console.log(
                "❌ Erro abrir modal:",
                error.message
            );


        }


    }

};