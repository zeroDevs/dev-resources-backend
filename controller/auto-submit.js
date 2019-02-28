const getUrl = require('../utils').getUrl;
const logger = require('../logger').log;
const dbHandler = require('../db/resource.db');

module.exports = (client, message) => {
    // This function has been called after a message has been detected in the dev-resources channel

    const messageUrls = getUrl(message.content)
    
    const channel = client.channels.get(process.env.RESOURCES_CHANNEL);
    
    if (messageUrls) {
        const authorObj = { 
            id: message.author.id, 
            username: message.author.username,
            discriminator: message.author.discriminator, 
            avatar: message.author.avatarURL 
        }

        Promise.all(
            messageUrls.map(url => {
            logger({
                author: message.author.username,
                type: 'Automatic Link Submission',
                url: url,
                status: 'URL Processed'
            });
            
            return dbHandler.create({ link: url, author: authorObj });
            })
        )
        .then(responses => {
            responses.forEach(response => {
                channel.send({
                    embed: {
                    color: 4647373,
                    title: response.payload.title,
                    url: response.payload.url,
                    description: "Thank you for submitting this resource, I am strong because of you 💪",
                    thumbnail: {
                        url: response.payload.image
                    },
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL
                    }
                    }
                });
                logger({
                    author: message.author.username,
                    type: 'Automatic Link Submission',
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
                type: 'Automatic Link Submission',
                url: error.payload.url,
                status: 'Error',
                message: error.message,
                avatar: message.author.avatarURL
                });
                console.log(error.message)
            });
    }
    
    // For the inital release version, this will do the job. We should eventually look at removing the original message
    // But we will want to monitor its working correctly for a while before removing them.

}