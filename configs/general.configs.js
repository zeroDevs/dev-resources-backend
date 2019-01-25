const tokens = require('./tokens.json')

const config = {
    // Tokens for the bot, with conditional statements. 
    // Ensure tokens.json contains your tokens unless you are using environment variables
    "botToken": (tokens.bottoken ? tokens.bottoken : process.env.BOT_TOKEN),
    "mongoUrl": (tokens.mongourl ? tokens.mongourl : process.env.MONGO_URL),

    // Command prefix
    "prefix": "+res",

    // Users with permission to edit links
    "editors": [],

    // Channels id, the bot uses
    "channels": {
        
    }
  };
  
  module.exports = config;