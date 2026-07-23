process.env.FFMPEG_PATH = require("ffmpeg-static");

const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");

const config = require("./config.json");


let settings = {
    prefix: "!"
};


if (fs.existsSync("./settings.json")) {
    settings = require("./settings.json");
}



const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent,

        GatewayIntentBits.GuildVoiceStates

    ]

});



client.commands = new Collection();




// ==========================
// CARREGAR COMANDOS
// ==========================

const commandFiles = fs
.readdirSync("./commands")
.filter(file => file.endsWith(".js"));


for (const file of commandFiles) {


    const command =
    require(`./commands/${file}`);


    client.commands.set(
        command.name,
        command
    );


}




// ==========================
// CARREGAR EVENTOS
// ==========================

const eventFiles = fs
.readdirSync("./events")
.filter(file => file.endsWith(".js"));



for (const file of eventFiles) {


    const event =
    require(`./events/${file}`);



    if(event.once){


        client.once(
            event.name,
            (...args)=>event.execute(...args)
        );


    }else{


        client.on(
            event.name,
            (...args)=>event.execute(...args)
        );


    }


}





// ==========================
// COMANDOS PREFIXO
// ==========================

client.on(
"messageCreate",
async message=>{


    if(message.author.bot)
        return;


    if(!message.guild)
        return;


    if(!message.content.startsWith(settings.prefix))
        return;



    const args =
    message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/\s+/);



    const commandName =
    args.shift().toLowerCase();



    const command =
    client.commands.get(commandName);



    if(!command)
        return;



    try{


        await command.execute(
            message,
            args
        );


    }catch(error){


        console.error(
            "Erro comando:",
            error
        );


        message.reply(
            "❌ Erro ao executar comando."
        ).catch(()=>{});


    }


});






// ==========================
// PROTEÇÃO
// ==========================

process.on(
"unhandledRejection",
error=>{

    console.error(
        "Erro protegido:",
        error
    );

});


process.on(
"uncaughtException",
error=>{

    console.error(
        "Erro protegido:",
        error
    );

});






// ==========================
// LOGIN
// ==========================

client.login(config.token)

.catch(error=>{


    console.error(
        "❌ Erro login:",
        error
    );


});