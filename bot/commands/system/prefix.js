const db = require('../../DB/sequelDB.js');

module.exports.commanddata = {
    name: "prefix",
    category: "system",
    cooldown: 20,
    guildOnly: true,
    args: true
};

module.exports.run = async (
    bot,
    message,
    args,
    prefix
) => {
    const newPrefix = args[0].trim().toLowerCase();

    if (message.author.id !== message.guild.ownerID) return message.channel.send("<:block:614100269004881924> Only the server owner may change the prefix!");
    if (newPrefix.length > 11) return message.channel.send("<:delete:614100269369655306> Prefix can be at most 10 characters long.");
    if (newPrefix.match(/^[\w\d\s\W]{1,10}$/i) === false) return message.channel.send("<:delete:614100269369655306> Prefix can only contain letters, numbers, special characters like ! or . and whitespace.");

    const [prefixDB, created] = await db.Prefix.findOrCreate({ where: { guildId: message.guild.id }, defaults: { guildId: message.guild.id, prefix: newPrefix } });
    if (created) {
        return message.channel.send(`<:approve:614100268891504661> Prefix updated to \`${newPrefix}\`! I will still respond to the original prefix too, just in case.`);
    } else {
        if (newPrefix === "reset") {
            await db.Prefix.destroy({ where: { guildId: message.guild.id } });
            return message.channel.send(`<:delete:614100269369655306> Custom prefix deleted.`);
        }
        await db.Prefix.update({ prefix: newPrefix }, { where: { guildId: message.guild.id } });
        return message.channel.send(`<:approve:614100268891504661> Prefix updated to \`${newPrefix}\`! I will still respond to the original prefix too, just in case.`);
    }
};