const fs = require('fs');
const path = require('path');
const utils = require('../utils');

let logChannel;

const logger = {};

logger.init = client => {
  logChannel = client.channels.get(process.env.LOG_CHANNEL);
};

logger.log = ({ type, url, author, raisedBy, status, message, avatar }) => {
  const log = message
    ? `TYPE: ${type}  URL: ${url} AUTHOR: ${author} RAISED BY: ${raisedBy} STATUS: ${status} MESSAGE: ${message}\n`
    : `TYPE: ${type}  URL: ${url} AUTHOR: ${author} RAISED BY: ${raisedBy} STATUS: ${status}\n`;
  const fileName = `${new Date().getUTCFullYear()}-${utils.paddTwo(
    new Date().getUTCMonth() + 1
  )}-${utils.paddTwo(new Date().getUTCDate())}.log`;
  fs.appendFile(
    path.resolve(__dirname, '../logs/', fileName),
    log,
    { flag: 'a', encoding: 'utf8' },
    err => {
      if (err) console.log(err);
    }
  );
  if (status === 'Success')
    sendEmbed({ author, avatar, url, status, message, type, color: 0x00ff00 });
  if (status === 'Error')
    sendEmbed({ author, avatar, url, status, message, type, color: 0xff0000 });
};

const sendEmbed = ({ author, avatar, url, status, type, message, color }) => {
  const embedMessage = {
    embed: {
      color: color,
      author: {
        name: author,
        icon_url: avatar
      },
      title: type,
      fields: [
        {
          name: 'URL',
          value: url,
          inline: true
        },
        {
          name: 'Status',
          value: status,
          inline: true
        },
        {
          name: 'Message',
          value: message
        }
      ],
      timestamp: new Date()
    }
  };
  logChannel.send(embedMessage);
};

module.exports = logger;
