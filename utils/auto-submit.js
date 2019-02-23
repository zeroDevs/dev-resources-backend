const getUrl = require('./get-url');
const logger = require('../logger').log;
const dbHandler = require('../db/resource.db');

module.exports = (client, message) => {
    // This function has been called after a message has been detected in the dev-resources channel

    // Step 1 - Extract the link from the message
    // The message variable, will contain the message object, 
    // Console log it to see what options are available
    // call the function on line one, using the best option you found in your console log as the param
    
    const messageUrls = getUrl(message.content)
    //console.log(url)
    const channel = client.channels.get(process.env.RESOURCES_CHANNEL);
    

    //Step 2 - Create an object for the Authors details
    // Using data you can get from the message object in the message variable
    if (messageUrls) {
        const authorObj = { 
            id: message.author.id, 
            username: message.author.username,
            discriminator: message.author.discriminator, 
            avatar: message.author.avatarURL 
        }

        //console.log(channel)
        Promise.all(
            messageUrls.map(url => {
            logger({
                author: message.author.username,
                type: 'Automatic Link Submission',
                url: url,
                status: 'URL Processed'
            });
            console.log(url, authorObj);
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
    

    // Step 3 - Submit the URL to the database
    // Passing the url variable you created in step 1 and the user object created in step 2
    // dbHandler.create({ link: url, author: authorObj })

    // Step 4 - If successful, make a simple post for now. 
    // You do this by using:
    // message.channel.send("Thank you for submitting the resource, it has been added to the DB!")

    // Step 5 - See if you can convert step 4 into a fancy embed
    // Use the object based embed detailed here:
    // https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/first-bot/using-embeds-in-messages.md#object-based-embeds
    // Try to fill the embed with as much detail of the link as possible

    // For the inital release version, this will do the job. We should eventually look at removing the original message
    // But we will want to monitor its working correctly for a while before removing them.

}