const cheerio = require('cheerio');
const request = require('request-promise-native');


module.exports = () => {
    request('http://www.google.com')
    .then(function (htmlString) {
        console.log(htmlString);
    })
    .catch(function (err) {
        console.log('crawling err', err.message)
    });
}