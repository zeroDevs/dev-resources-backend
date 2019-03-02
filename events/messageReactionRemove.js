module.exports = async (client, reaction, user) => {
    if (reaction.emoji.name !== process.env.RUSTY_EMOJI) return;
    const message = reaction.message;
   
    if (reaction.count <= 1) {
        message.react(process.env.RUSTY_EMOJI);
    }
};