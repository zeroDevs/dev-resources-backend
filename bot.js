const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('./app');

// New event handler, allows us to split events into thier own files;
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.login(process.env.BOT_TOKEN);
