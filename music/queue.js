const queues = new Map();




function createQueue(guildId, data = {}) {


    const queue = {


        // ID do servidor
        guildId: guildId,


        // músicas
        songs: [],


        // música atual
        current: null,


        // canais
        voiceChannel: null,
        textChannel: null,



        // conexão e player
        connection: null,
        player: null,



        // configurações
        volume: 50,
        loop: false,



        // painel
        panelMessage: null,



        // tempo da música
        startedAt: null,
        duration: 0,



        // controles
        paused: false,
        playing: false,



        // recurso áudio
        resource: null,



        // processos
        ytProcess: null,
        ffmpegProcess: null,



        ...data

    };





    queues.set(
        guildId,
        queue
    );



    return queue;

}







function getQueue(guildId){


    return queues.get(
        guildId
    );


}







function get(guildId){


    return queues.get(
        guildId
    );


}







function deleteQueue(guildId){



    const queue =
    queues.get(
        guildId
    );



    if(queue){


        try{


            if(queue.connection){

                queue.connection.destroy();

            }


        }catch{}



    }




    queues.delete(
        guildId
    );


}







function hasQueue(guildId){


    return queues.has(
        guildId
    );


}







module.exports = {


    queues,


    createQueue,


    getQueue,


    get,


    deleteQueue,


    hasQueue


};