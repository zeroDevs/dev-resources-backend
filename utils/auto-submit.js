const getUrl = require('../utils').getUrl;

module.exports = (client, message) => {
    // This function has been called after a message has been detected in the dev-resources channel

    // Step 1 - Extract the link from the message
    // The message variable, will contain the message object, 
    // Console log it to see what options are available
    // call the function on line one, using the best option you found in your console log as the param
    // eg. const url = getURL(<message param>)

    //Step 2 - Create an object for the Authors details
    // Using data you can get from the message object in the message variable
    // Eg. const authorObj = { id: <userID>, username: <username>, discriminator: <discriminator>, avatar: <avatar-url> }

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