const getUrl = require('../utils').getUrl;
const logger = require('../logger').log;
const dbHandler = require('../db/resource.db');

module.exports = async (client, reaction, user) => {
  //checks for specific emoji(for now use the thinking emoji) and also that the reaction
  //was not made by a bot

  if (reaction.emoji.name !== process.env.RUSTY_EMOJI || user.bot) return;

  
  if (reaction.count > 1) return;

  const message = reaction.message;

  if (message.author.bot) return; //resource was not sent by a bot

  if (reaction.message.channel.id === receveingChannel.id) return;

  logger({
    author: message.author.username,
    raisedBy: user.username,
    type: 'Manual Link Submission',
    url: 'N/A',
    status: 'Received',
    message: reaction.message
  });

  let messageUrls = getUrl(message.content);

  if (messageUrls) {
    let authorObj = {
      id: message.author.id,
      username: message.author.username,
      discriminator: message.author.discriminator,
      avatar: message.author.avatarURL
    };
    Promise.all(
      messageUrls.map(url => {
        logger({
          author: message.author.username,
          raisedBy: user.username,
          type: 'Manual Link Submission',
          url: url,
          status: 'URL Processed'
        });
        return dbHandler.create({ link: url, author: authorObj });
      })
    )
      .then(responses => {
        responses.forEach(response => {
          message.react(process.env.SENT_EMOJI);
          receveingChannel.send({
            embed: {
              color: 4647373,
              title: response.payload.title,
              url: response.payload.url,
              description: response.payload.description,
              thumbnail: {
                url: response.payload.image
              },
              author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
              }
            }
          }).then(sendEmbed => sendEmbed.react(process.env.SENT_EMOJI));
          logger({
            author: message.author.username,
            raisedBy: user.username,
            type: 'Manual Link Submission',
            url: response.payload.url,
            status: 'Success',
            avatar: message.author.avatarURL,
            message: response.message
          });
        });
      })
      .catch(error => {
        logger({
          author: message.author.username,
          raisedBy: user.username,
          type: 'Manual Link Submission',
          url: error.payload.url,
          status: 'Error',
          message: error.message,
          avatar: message.author.avatarURL
        });
      });
  }
};
