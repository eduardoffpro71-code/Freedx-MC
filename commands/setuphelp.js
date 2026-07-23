const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


module.exports = {

    name: "setuphelp",


    async execute(message) {


        const embed = new EmbedBuilder()

            .setColor("#00FFFF")

            .setTitle("🎵 Freedx MC • Central de Ajuda")

            .setDescription(`
Bem-vindo ao painel de ajuda do **Freedx MC** 🎧

Clique nos botões abaixo para ver:

🎶 Comandos de música  
⚙️ Sistema do bot  
👑 Informações do criador
            `)

            .setFooter({
                text: "Freedx MC 🎧"
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
                .setStyle(ButtonStyle.Success)

        );



        message.channel.send({

            embeds: [embed],

            components: [row]

        });


        message.delete()
        .catch(()=>{});


    }

};