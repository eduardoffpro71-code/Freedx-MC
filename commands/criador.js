const {
    EmbedBuilder
} = require("discord.js");


module.exports = {

    name: "criador",


    async execute(message) {


        const criador = await message.client.users.fetch(
            "1337304811821072424"
        );


        const embed = new EmbedBuilder()

            .setColor("#00FFFF")

            .setTitle("👑 Freedx MC • Criador")

            .setDescription(`

🎵 **Freedx MC**

👑 Criador:

**${criador.username}**

💻 Desenvolvedor do sistema  
🎧 Music System  
🎛️ Painel Interativo  

Obrigado por usar o Freedx MC ❤️

            `)

            .setThumbnail(
                criador.displayAvatarURL({
                    size: 1024
                })
            )

            .setFooter({
                text: "Freedx MC 🎧"
            })

            .setTimestamp();



        message.channel.send({
            embeds: [embed]
        });


    }

};