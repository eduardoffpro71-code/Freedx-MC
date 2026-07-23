module.exports = function isDJ(message) {

    if (message.member.permissions.has("Administrator")) {
        return true;
    }

    const role = message.guild.roles.cache.find(
        r => r.name.toLowerCase() === "dj"
    );

    if (!role) return false;

    return message.member.roles.cache.has(role.id);

};