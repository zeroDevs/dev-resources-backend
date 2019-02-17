module.exports = message => {
  let regex = /(?:https?|ftp|www)(?=:\/\/|\.)[\n\S]+/g;
  let urls = message.match(regex);

  return urls;
};
