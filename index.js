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

if (fs.existsSync("./config.json")) {

    config = require("./config.json");

}


// ==========================
// SETTINGS
// ==========================

let settings = {
    prefix: "!"
};


if (fs.existsSync("./settings.json")) {

    settings = require("./settings.json");

}


// ==========================
// CLIENT
// ==========================

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

if (fs.existsSync("./commands")) {


    const files = fs.readdirSync("./commands")
    .filter(file => file.endsWith(".js"));


    for (const file of files) {


        const command = require(`./commands/${file}`);


        if (command.name) {

            client.commands.set(
                command.name,
                command
            );

        }

    }

}



// ==========================
// CARREGAR EVENTOS
// ==========================

if (fs.existsSync("./events")) {


    const files = fs.readdirSync("./events")
    .filter(file => file.endsWith(".js"));


    for (const file of files) {


        const event = require(`./events/${file}`);


        if (event.once) {


            client.once(
                event.name,
                (...args)=>event.execute(...args)
            );


        } else {


            client.on(
                event.name,
                (...args)=>event.execute(...args)
            );


        }

    }

}



// ==========================
// COMANDOS COM PREFIXO
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



    const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/\s+/);



    const commandName = args.shift()
    .toLowerCase();



    const command = client.commands.get(commandName);



    if(!command)
        return;



    try {

        await command.execute(
            message,
            args
        );


    } catch(error) {


        console.log(
            "❌ Erro comando:",
            error
        );


    }


});




// ==========================
// ERROS
// ==========================

process.on(
"unhandledRejection",
error=>{
    console.log(
        "❌ Erro:",
        error
    );
});



process.on(
"uncaughtException",
error=>{
    console.log(
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
        "❌ TOKEN não encontrado"
    );

    process.exit(1);

}



client.login(TOKEN)

.then(()=>{


    console.log(
        "🚀 Bot online!"
    );


    console.log(
        `✅ ${client.user.tag}`
    );


})


.catch(error=>{


    console.log(
        "❌ Erro login:",
        error
    );


});