const cheerio = require('cheerio');
const request = require('request-promise-native');


module.exports = (uri) => {

    return new Promise((resolve, reject) => {
        let siteData = {};
        let options = {
            method: 'GET',
            uri,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options)
            .then(function ($) {

                    title = $('head title').text(),
                    desc = $('meta[name="description"]').attr('content'),
                    ogTitle = $('meta[property="og:title"]').attr('content'),
                    ogImage = $('meta[property="og:image"]').attr('content'),
                    descHead = $('body h1').text() //not the best approach for a sub description
                
                siteData.title = title;
                siteData.desc = desc;
                siteData.ogTitle = ogTitle;
                siteData.ogImage = ogImage;
                siteData.descHead = descHead;

                resolve(siteData);
            })
            .catch(function (err) {
                reject(siteData);
            });
    
});   
    
}