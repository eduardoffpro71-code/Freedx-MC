const {
    startPanelUpdater
} = require("../music/panelUpdater");


const {
    createPanel
} = require("../music/autoPanel");



module.exports = {

    name: "clientReady",

    once: true,


    async execute(client) {


        console.log(
            `✅ ${client.user.tag} online!`
        );


        try {


            // cria painel automático
            await createPanel(client);


            console.log(
                "✅ Painel automático carregado!"
            );



        } catch(error) {


            console.log(
                "⚠️ Erro no painel:",
                error.message
            );


        }



        try {


            // inicia atualizador
            startPanelUpdater(client);



            console.log(
                "🎵 Freedx MC Music System iniciado!"
            );



        } catch(error) {


            console.log(
                "❌ Erro no atualizador:",
                error.message
            );


        }


    }

};