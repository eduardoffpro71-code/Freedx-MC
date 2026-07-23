const {
    EmbedBuilder
} = require("discord.js");


const queues = require("./queue");


let config = {};

try {

    config = require("../config.json");

} catch {

    console.log(
        "⚠️ config.json não encontrado, usando Railway Variables"
    );

}


let updaterStarted = false;



function formatTime(seconds){

    if(!seconds || seconds < 0){

        return "0:00";

    }


    const minutes =
    Math.floor(seconds / 60);


    const secs =
    seconds % 60;


    return `${minutes}:${secs
        .toString()
        .padStart(2,"0")}`;

}




function progressBar(current,total){

    const size = 20;


    if(!total || total <= 0){

        return "━━━━━━━━━━━━━━━━━━━━";

    }


    const percent =
    Math.min(
        current / total,
        1
    );


    const position =
    Math.floor(
        size * percent
    );


    return (
        "━".repeat(position)
        +
        "🔵"
        +
        "━".repeat(
            size - position
        )
    );

}





async function updatePanel(client, queue){


    if(
        !queue.current ||
        !queue.startedAt
    ){

        return;

    }



    const panelChannel =
    process.env.PANEL_CHANNEL || config.panelChannel;


    const panelMessage =
    process.env.PANEL_MESSAGE || config.panelMessage;



    if(
        !panelChannel ||
        !panelMessage
    ){

        return;

    }





    try{


        const canal =
        await client.channels.fetch(
            panelChannel
        );


        if(!canal)
            return;




        const mensagem =
        await canal.messages.fetch(
            panelMessage
        );




        const elapsed =
        Math.floor(
            (Date.now() - queue.startedAt) / 1000
        );



        const total =
        queue.duration || 0;




        const embed =
        new EmbedBuilder()

        .setColor("#00FFFF")

        .setTitle(
            "🎵 Freedx MC • Tocando Agora"
        )

        .setDescription(

`
🎶 **${queue.current.title}**


${progressBar(
    elapsed,
    total
)}


⏱️ ${formatTime(elapsed)} / ${formatTime(total)}


👤 Pedido por:
**${queue.current.requestedBy || "Desconhecido"}**


🔊 Volume:
**${queue.volume}%**


🔁 Loop:
**${
queue.loop
?
"Ativado"
:
"Desativado"
}**
`

        )

        .setFooter({

            text:
            "Freedx MC • Music System"

        })

        .setTimestamp();




        if(queue.current.thumbnail){

            embed.setThumbnail(
                queue.current.thumbnail
            );

        }





        await mensagem.edit({

            embeds:[
                embed
            ]

        });



    }catch(error){


        console.log(
            "❌ Erro atualizar painel:",
            error.message
        );


    }


}






function startPanelUpdater(client){


    if(updaterStarted)
        return;



    updaterStarted = true;



    console.log(
        "🎵 Atualizador do painel iniciado!"
    );





    setInterval(async()=>{


        try{


            for(
                const queue of queues.queues.values()
            ){


                await updatePanel(
                    client,
                    queue
                );


            }


        }catch(error){


            console.log(
                "❌ Erro no updater:",
                error.message
            );


        }


    },5000);



}






module.exports = {

    startPanelUpdater,

    updatePanel,

    formatTime,

    progressBar

};