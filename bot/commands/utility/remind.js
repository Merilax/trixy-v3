const db = require('../../DB/sequelDB.js');
const TxTE = require("../../TxTE.json");

module.exports.commanddata = {
  name: "remind",
  aliases: ["remindme", "note"],
  category: "utility",
  cooldown: 2,
  args: true,
  guildOnly: false
};

module.exports.run = async (
  bot,
  message,
  args,
  prefix
) => {
  let remindContent = args.slice(1).join(" ");
  let remindTiming = args[0];

  if (!remindContent)
    return message.channel.send({ content: `${TxTE.emoji.quote} You should tell me what to remind you.` });
  if (remindTiming.match(/^\d+$/) != null) { } else {
    return message.channel.send({ content: `${TxTE.emoji.quote} For how long? The input will be in minutes, as the first argument.` });
  }

  if (remindTiming && (remindTiming < 525600) && (remindTiming > 0)) {
    var remindThen = Date.now() + (parseInt(remindTiming) * 60000);
  } else {
    return message.channel.send({ content: `${TxTE.emoji.x} Can't do, you may set a maximum of 525600 minutes, which is actually a year.` });
  }

  try {
    await db.Reminders.create({ userId: message.author.id, duration: remindThen, text: remindContent });
    message.channel.send({ content: `${TxTE.emoji.ok} ${TxTE.affirmation[Math.floor(Math.random() * TxTE.affirmation.length)]} I will remind you in ${remindTiming} minutes.` });
  } catch (e) {
    console.log(e);
  }
};
