module.exports = {

    command(message, commandName) {

        console.log(
            `[COMANDO] ${message.author.tag} usou !${commandName} no servidor ${message.guild.name}`
        );

    }

};