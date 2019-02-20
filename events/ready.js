const mongoose = require('mongoose');
const logger = require('../logger');

module.exports = async client => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${
      client.channels.size
    } channels of ${client.guilds.size} guilds.`
  );

  // This sets the bots activity message
  client.user.setActivity(`Serving ${client.guilds.size} servers`);

  //   // This will console log the bots invite code
  try {
    //the dev-resource channel id should go here
    receveingChannel = client.channels.get(process.env.RESOURCES_CHANNEL);
    let link = await client.generateInvite(['ADMINISTRATOR']);
    console.log('Bot Invite: ' + link);
  } catch (e) {
    console.log(e.stack);
  }

  //Connect to the database
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => console.log('Connected to the database'));
  logger.init(client);
};
