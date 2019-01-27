// Load up the discord.js library
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();

const dbHandler = require('./db/resource.db');
const web = require('./app');

let receveingChannel;
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
    //the dev-resource channel id should go here
    receveingChannel = client.channels.get('520663989819277312');
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

const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

//listen for events specified in the events object above 
client.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;
  
  const {d} = event; //gets useful data from the event, like user_id, channel_id....
  const channel = client.channels.get(d.channel_id); 
  const user = client.users.get(d.user_id); 
  
  if (event.t !== 'MESSAGE_REACTION_REMOVE')
    if (channel.messages.has(d.message_id)) return;
  
  const message = await channel.fetchMessage(d.message_id);

  const emojiKey = (d.emoji.id) ? d.emoji.id : d.emoji.name;
  let reaction = message.reactions.get(emojiKey)

  if (!reaction) {
    // Create an object that can be passed through the event like normal
    const emoji = new Discord.Emoji(client.guilds.get(d.guild_id), d.emoji);
    reaction = new Discord.MessageReaction(message, emoji, 1, d.user_id === client.user.id);
  }

  client.emit(events[event.t], reaction, user);
});

//listens for added reaction
client.on('messageReactionAdd', async (reaction, user) => {

  //checks for specific emoji(for now use the thinking emoji) and also that the reaction 
  //was not made by a bot
  if (reaction.emoji.name !== '🤔' || user.bot) return;

  if (reaction.count > 1) 
  {
    client.emit('messageReactionRemove', reaction, user);
    return;
  }
  
  const message = reaction.message;

  if (message.author.bot) return; //resource was not sent by a bot
  
  
  receveingChannel.send({embed: {
    color: 4647373,
    title: "A useful resource",
    description: message.content,
    author: {
      name: message.author.username,
      icon_url: message.author.avatarURL
    }
  }});
});

//listen for a reaction removed
client.on('messageReactionRemove', (reaction, user) => {
  if (reaction.emoji.name !== '🤔') return;
  const message = reaction.message;
  if (reaction.count >= 1) {
    message.react('🤔');
  }
});

client.login(process.env.BOT_TOKEN);
