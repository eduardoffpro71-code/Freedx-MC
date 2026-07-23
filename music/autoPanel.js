const {
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const fs = require("fs");
const path = require("path");



const configPath = path.join(
    __dirname,
    "../config.json"
);



let config = {};



// tenta carregar config local
if(fs.existsSync(configPath)){

    try{

        config = require(configPath);

    }catch{

        console.log(
            "⚠️ Erro lendo config.json"
        );

    }

}else{

    console.log(
        "⚠️ config.json não encontrado, usando Railway Variables"
    );

}








async function createPanel(client){


    console.log(
        "🎵 Verificando painel automático..."
    );


    try{


        const guild =
        client.guilds.cache.first();



        if(!guild){

            console.log(
                "❌ Nenhum servidor encontrado"
            );

            return;

        }






        let panelChannel =
        process.env.PANEL_CHANNEL ||
        config.panelChannel;



        let panelMessage =
        process.env.PANEL_MESSAGE ||
        config.panelMessage;





        let canal;





        if(panelChannel){


            canal =
            guild.channels.cache.get(
                panelChannel
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



            panelChannel =
            canal.id;


        }









        if(panelMessage){


            try{


                await canal.messages.fetch(
                    panelMessage
                );


                console.log(
                    "✅ Painel já existe!"
                );


                return;



            }catch{


                panelMessage = null;


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








        console.log(
            "✅ Painel criado!"
        );



        console.log(
            "📌 Canal:",
            canal.id
        );


        console.log(
            "📌 Mensagem:",
            painel.id
        );






        // salva somente se existir config local
        if(fs.existsSync(configPath)){


            config.panelChannel =
            canal.id;


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


        }





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