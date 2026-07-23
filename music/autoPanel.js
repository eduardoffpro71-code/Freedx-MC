const {
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const fs = require("fs");
const path = require("path");



const panelsPath =
path.join(
    __dirname,
    "../data/panels.json"
);





if(!fs.existsSync(path.dirname(panelsPath))){

    fs.mkdirSync(
        path.dirname(panelsPath),
        {
            recursive:true
        }
    );

}




if(!fs.existsSync(panelsPath)){

    fs.writeFileSync(
        panelsPath,
        "{}"
    );

}





function loadPanels(){

    try{

        return JSON.parse(
            fs.readFileSync(
                panelsPath,
                "utf8"
            )
        );

    }catch{

        return {};

    }

}






function savePanels(data){

    fs.writeFileSync(
        panelsPath,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}









async function createPanel(client){


    console.log(
        "🎵 Verificando painéis..."
    );



    const panels =
    loadPanels();





    for(
        const guild of client.guilds.cache.values()
    ){


        try{



            // já existe
            if(panels[guild.id]){


                console.log(
                    `✅ Painel já existe: ${guild.name}`
                );


                continue;

            }







            const canal =
            await guild.channels.create({


                name:
                "🎵・freedx-player",


                type:
                ChannelType.GuildText,


                topic:
                "Painel automático Freedx MC"


            });









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









            const mensagem =
            await canal.send({

                embeds:[
                    embed
                ],

                components:[
                    row1,
                    row2
                ]

            });









            panels[guild.id] = {


                channel:
                canal.id,


                message:
                mensagem.id


            };








            savePanels(
                panels
            );






            console.log(
                `✅ Painel criado em ${guild.name}`
            );



        }catch(error){


            console.log(
                `❌ Erro painel ${guild.name}:`,
                error.message
            );


        }


    }



}







module.exports = {

    createPanel

};