// Load up the discord.js library
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();

const dbHandler = require('./db/resource.db');
const web = require('./app');

// This event will run if the bot starts, and logs in, successfully.
client.on('ready', async () => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${
      client.channels.size
    } channels of ${client.guilds.size} guilds.`
  );
  // This sets the bots activity message
  client.user.setActivity(`Serving ${client.guilds.size} servers`);

  // This will console log the bots invite code
  try {
    let link = await client.generateInvite(['ADMINISTRATOR']);
    console.log('Bot Invite: ' + link);
  } catch (e) {
    console.log(e.stack);
  }

  //Connect to the database
  mongoose.set('useCreateIndex', true);
  mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true }
  );
});

// This event will run on every single message received, from any channel or DM.
client.on('message', async message => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // so it doesnt get caught up in a loop.
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the environmental variable.
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
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
});

client.login(process.env.BOT_TOKEN);
//test