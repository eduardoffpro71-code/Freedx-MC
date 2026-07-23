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


            await createPanel(client);



            startPanelUpdater(client);



            console.log(
                "🎵 Freedx MC Music System iniciado!"
            );



        } catch(error) {


            console.log(
                "❌ Erro ao iniciar sistema:",
                error.message
            );


        }


    }

};