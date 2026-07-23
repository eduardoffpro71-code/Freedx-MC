const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");


module.exports = {

    name: "setup",

    async execute(message) {

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("❌ Você precisa ser administrador.");
        }


        const guild = message.guild;


        await message.reply("⚙️ Criando estrutura do Freedx MC...");


        // Cargos
        const cargos = [
            "👑 Fundador",
            "⚡ Administrador",
            "🛡 Moderador",
            "🎧 DJ",
            "⭐ VIP",
            "🎮 Jogador"
        ];


        for (const cargo of cargos) {

            const existe = guild.roles.cache.find(
                r => r.name === cargo
            );

            if (!existe) {
                await guild.roles.create({
                    name: cargo
                });
            }

        }


        // Categorias e canais

        const estrutura = {

            "📌 INÍCIO": [
                "📜・regras",
                "📢・anuncios",
                "💡・sugestoes"
            ],


            "💬 COMUNIDADE": [
                "💬・chat-geral",
                "🎮・minecraft",
                "😂・memes"
            ],


            "🎵 FREEDX MUSIC": [
                "🎶・comandos-musica",
                "🎧・fila-musical"
            ],


            "🛠 SUPORTE": [
                "🎫・tickets",
                "❓・ajuda"
            ],


            "🔒 STAFF": [
                "👑・staff-chat",
                "📋・logs"
            ]

        };


        for (const categoria in estrutura) {


            let cat = guild.channels.cache.find(
                c =>
                c.name === categoria &&
                c.type === ChannelType.GuildCategory
            );


            if (!cat) {

                cat = await guild.channels.create({
                    name: categoria,
                    type: ChannelType.GuildCategory
                });

            }


            for (const canal of estrutura[categoria]) {


                const existe = guild.channels.cache.find(
                    c => c.name === canal
                );


                if (!existe) {

                    await guild.channels.create({

                        name: canal,

                        type: ChannelType.GuildText,

                        parent: cat.id

                    });

                }

            }

        }


        // Voz

        await guild.channels.create({

            name: "🔊 Sala Música",

            type: ChannelType.GuildVoice

        });


        message.channel.send(
            "✅ Freedx MC configurado com sucesso!"
        );


    }

};