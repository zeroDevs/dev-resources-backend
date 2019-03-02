const Discord = require('discord.js');

module.exports = async (client, event) => {
    const events = {
        MESSAGE_REACTION_ADD: 'messageReactionAdd',
        MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
    };

    if (!events.hasOwnProperty(event.t)) return;

    const { d } = event; //gets useful data from the event, like user_id, channel_id....
    const channel = client.channels.get(d.channel_id);
    const user = client.users.get(d.user_id);

    if (event.t !== 'MESSAGE_REACTION_REMOVE')
        if (channel.messages.has(d.message_id)) return;

    const message = await channel.fetchMessage(d.message_id);

    const emojiKey = d.emoji.id ? d.emoji.id : d.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Discord.Emoji(client.guilds.get(d.guild_id), d.emoji);
        reaction = new Discord.MessageReaction(
            message,
            emoji,
            1,
            d.user_id === client.user.id
        );
    }

    client.emit(events[event.t], reaction, user);
};
