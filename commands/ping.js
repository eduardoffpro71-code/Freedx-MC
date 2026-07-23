module.exports = {
    name: "ping",
    description: "Mostra a latência do bot",

    execute(message) {
        message.reply(`🏓 Pong! Latência: ${message.client.ws.ping}ms`);
    }
};