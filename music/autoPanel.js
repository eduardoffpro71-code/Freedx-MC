const {
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const fs = require("fs");
const path = require("path");


const configPath =
path.join(
    __dirname,
    "../config.json"
);




async function createPanel(client){


    console.log(
        "🎵 Verificando painel automático..."
    );



    try{


        const config =
        require("../config.json");



        const guild =
        client.guilds.cache.first();



        if(!guild){

            console.log(
                "❌ Nenhum servidor encontrado"
            );

            return;

        }




        let canal;



        if(config.panelChannel){


            canal =
            guild.channels.cache.get(
                config.panelChannel
            );


        }






        if(!canal){


            canal =
            await guild.channels.create({

                name:
                "🎵・freedx-player",

                type:
                ChannelType.GuildText,

                topic:
                "Painel automático Freedx MC"

            });



            config.panelChannel =
            canal.id;


        }








        if(config.panelMessage){


            try{


                await canal.messages.fetch(
                    config.panelMessage
                );


                console.log(
                    "✅ Painel já existe!"
                );


                return;


            }catch{


                config.panelMessage = null;


            }


        }







        const embed =
        new EmbedBuilder()

        .setColor("#00FFFF")

        .setTitle(
            "🎧 Freedx MC • Music System"
        )

        .setDescription(
`
🎶 **Nenhuma música tocando**

Use os botões abaixo para controlar o player.
`
        )

        .setFooter({

            text:
            "Freedx MC 🎧"

        })

        .setTimestamp();







        const row1 =
        new ActionRowBuilder()

        .addComponents(


            new ButtonBuilder()
            .setCustomId("music_play")
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Success),



            new ButtonBuilder()
            .setCustomId("music_pause")
            .setEmoji("⏸️")
            .setStyle(ButtonStyle.Secondary),



            new ButtonBuilder()
            .setCustomId("music_next")
            .setEmoji("⏭️")
            .setStyle(ButtonStyle.Primary),



            new ButtonBuilder()
            .setCustomId("music_stop")
            .setEmoji("⏹️")
            .setStyle(ButtonStyle.Danger)


        );







        const row2 =
        new ActionRowBuilder()

        .addComponents(


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
            .setStyle(ButtonStyle.Success),



            new ButtonBuilder()
            .setCustomId("music_search")
            .setLabel("🔎 Pesquisar")
            .setStyle(ButtonStyle.Primary)


        );







        const painel =
        await canal.send({

            embeds:[
                embed
            ],

            components:[
                row1,
                row2
            ]

        });







        config.panelMessage =
        painel.id;






        fs.writeFileSync(

            configPath,

            JSON.stringify(
                config,
                null,
                4
            )

        );






        console.log(
            "✅ Painel criado e salvo!"
        );



    }catch(error){


        console.log(
            "❌ Erro criar painel:",
            error.message
        );


    }


}





module.exports = {

    createPanel

};