const router = require('express').Router();
const { getBotGuilds } = require('../utils/guilds');
const { getMutualGuilds } = require('../utils/mutualGuilds')
const User = require('../../bot/DB/modals/DiscordUser');

router.get('/guilds', async (req, res) => {
    const guilds = await getBotGuilds();
    const user = User.findOne({ userId: req.user.userId });
    if (user) {
        const userGuilds = user.get('guilds');
        const mutualGuilds = getMutualGuilds(userGuilds, guilds);
        res.send(mutualGuilds);
    } else {
        return res.status(401).send({ msg: 'Unauthorized' });
    }
});

module.exports = router;