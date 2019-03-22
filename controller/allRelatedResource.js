const dbhandler = require('../db/resource.db');
const escp = require('../utils').escapeString;
const stopword = require('stopword');

/*function to get all related resource based on the algorithm on this site 
http://www.catalysoft.com/articles/StrikeAMatch.html*/

const allRelatedResource = async (currentArticle) => {
    const allResources = await dbhandler.readAll();

    let allTitlesArr = allResources.payload.resources.map(resource =>
        /*get non noise words from all articles in DB and their meta titles*/
        [stopword.removeStopwords(escp(resource.meta.title).toUpperCase().split(/\s+/)), 
        resource.slug]
    );

    /*get non noise words from the currently read article*/
    currentArticleWords = stopword.removeStopwords(escp(currentArticle).toUpperCase().split(/\s+/));
    
    /*get the relativity value between 0 to 1*/
    const relatedFigures = allTitlesArr.filter((title) => {
        let figure = compareArticles(currentArticleWords, title[0])
        if (figure >= 0.4 && figure < 1)
            return title;
    })

    /*returns the slug of the related resources*/
    return relatedFigures.map(title => title[1]);
}

/*pair adjacent letters in word*/
const letterPairs = (word) => {
    let len = word.length - 1;
    let pairs = [];
    for (let i = 0; i < len; i++) {
        pairs[i] = word.substring(i, i + 2);
    }

    return pairs;
}

const wordLetterPairs = (articleWords) => {
    let allPairs = [];
    // For each word
    for (let l = 0; l < articleWords.length; l++) {
        // Find the pairs of characters
        let pairsInWord = letterPairs(articleWords[l]);
        allPairs = [...allPairs, ...pairsInWord];
    }

    return allPairs;
}

const compareArticles = (currentArticle, dbArticle) => {

    const currentArticlePairs = wordLetterPairs(currentArticle);

    const dbArticlePairs = wordLetterPairs(dbArticle);

    let intersection = 0;

    const union = currentArticlePairs.length + dbArticlePairs.length;

    for (let i = 0; i < currentArticlePairs.length; i++) {

            let pair1 = currentArticlePairs[i];

        for (let j = 0; j < dbArticlePairs.length; j++) {

            let pair2 = dbArticlePairs[j];

            if (pair1 === pair2) {

                intersection++;

                dbArticlePairs.splice(j,1);

                break;

            }

        }

}
return (2.0 * intersection) / union;
}


module.exports = allRelatedResource;
