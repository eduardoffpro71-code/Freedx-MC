try {
    process.env.FFMPEG_PATH = require("ffmpeg-static");
} catch {
    console.log("⚠️ ffmpeg-static não encontrado");
}


const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");


const fs = require("fs");




// ==========================
// CONFIG
// ==========================

let config = {};


if(fs.existsSync("./config.json")){


    try {

        config = require("./config.json");

    } catch {

        console.log(
            "⚠️ Erro lendo config.json"
        );

    }


}else{


    console.log(
        "⚠️ config.json não encontrado, usando Railway Variables"
    );


}






// ==========================
// SETTINGS
// ==========================

let settings = {
    prefix: "!"
};


if(fs.existsSync("./settings.json")){

    settings = require("./settings.json");

}






// ==========================
// CLIENT
// ==========================

const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent,

        GatewayIntentBits.GuildVoiceStates

    ]

});



client.commands = new Collection();






// ==========================
// COMANDOS
// ==========================

if(fs.existsSync("./commands")){


const commandFiles = fs
.readdirSync("./commands")
.filter(file => file.endsWith(".js"));



for(const file of commandFiles){


    const command =
    require(`./commands/${file}`);



    if(command.name){

        client.commands.set(
            command.name,
            command
        );

    }


}


}







// ==========================
// EVENTOS
// ==========================


if(fs.existsSync("./events")){


const eventFiles = fs
.readdirSync("./events")
.filter(file => file.endsWith(".js"));



for(const file of eventFiles){


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


}







// ==========================
// PREFIX COMMANDS
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
            "❌ Erro comando:",
            error
        );


    }


});







// ==========================
// PROTEÇÃO
// ==========================

process.on(
"unhandledRejection",
error=>{

    console.error(
        "❌ Unhandled:",
        error
    );

});



process.on(
"uncaughtException",
error=>{

    console.error(
        "❌ Exception:",
        error
    );

});







// ==========================
// LOGIN
// ==========================


const TOKEN =
process.env.TOKEN || config.token;



if(!TOKEN){


    console.log(
        "❌ TOKEN não encontrado!"
    );


    process.exit(1);

}





client.login(TOKEN)

.then(()=>{


    console.log(
        "🚀 Login realizado!"
    );


})

.catch(error=>{


    console.error(
        "❌ Erro login:",
        error
    );


});