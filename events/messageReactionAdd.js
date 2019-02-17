const getUrl = require('../utils').getUrl;
const dbHandler = require('../db/resource.db');

module.exports = async (client, reaction, user) => {
    //checks for specific emoji(for now use the thinking emoji) and also that the reaction
    //was not made by a bot

    if (reaction.emoji.name !== process.env.RUSTY_EMOJI || user.bot) return;

    if (reaction.count > 1) {
        client.emit('messageReactionRemove', reaction, user);
        return;
    }

    const message = reaction.message;

    if (message.author.bot) return; //resource was not sent by a bot

    if (reaction.message.channel.id === receveingChannel.id) return;
    let messageUrls = getUrl(message.content);
    console.log(messageUrls)

    if (messageUrls) {
        let authorObj = {
            id: message.author.id,
            username: message.author.username,
            discriminator: message.author.discriminator,
            avatar: message.author.avatarURL
        };
        Promise.all(
            messageUrls.map(url => dbHandler.create({ link: url, author: authorObj }))
        )
            .then(responses => {
                console.log(responses);
                responses.forEach(response => {
                    receveingChannel.send({
                        embed: {
                            color: 4647373,
                            title: response.payload.title,
                            url: response.payload.url,
                            description: response.payload.description,
                            thumbnail: {
                                "url": response.payload.image
                            },
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            }
                        }
                    });
                });
            })
            .catch(errors => console.log(errors));
    }
};