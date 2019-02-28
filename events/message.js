const autoSubmit = require('../controller/auto-submit');

module.exports = async (client, message) => {

    // Ignore bots
    if (message.author.bot) return;

    if (message.channel.id === process.env.RESOURCES_CHANNEL) autoSubmit(client, message)
    else {
        // Ignore msgs without prefix
        if (message.content.indexOf(process.env.PREFIX) !== 0) return;

        // Seperate command and arguments
        const args = message.content
            .slice(process.env.PREFIX.length)
            .trim()
            .split(/ +/g);
        const command = args.shift().toLowerCase();

        // Commands will go here:
        if (command === 'ping') {
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m = await message.channel.send('Ping?');
            m.edit(
                `Pong! Latency is ${m.createdTimestamp -
                message.createdTimestamp}ms. API Latency is ${Math.round(
                    client.ping
                )}ms`
            );
        }
    }

};