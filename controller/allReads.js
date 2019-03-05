const dbhandler = require('../db/resource.db');
const escp = require('../utils').escapeString;
const stopword = require('stopword');

const allReads = async (currentArticle) => {
    const x = await dbhandler.readAll();
    let allTopicArr = x.payload.resources.map(e =>
        stopword.removeStopwords(escp(e.meta.title).toUpperCase().split(/\s+/))
    );

    currentArticleWords = stopword.removeStopwords(escp(currentArticle).toUpperCase().split(/\s+/));
    //console.log("input", currentArticleWords);

    const relatedFigures = allTopicArr.filter((topic) => {
        let figure = compareArticles(currentArticleWords, topic)
        if (figure >= 0.4 && figure < 1)
            return topic.join(' ');
    })

    //let allTopics = wordLetterPairs(currentArticleWords)
    console.log(relatedFigures);
}

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
        //console.log("test", articleWords[l]);
        let pairsInWord = letterPairs(articleWords[l]);
        //for (let p = 0; p < pairsInWord.length; p++) {
        allPairs = [...allPairs, ...pairsInWord];
        //}
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


module.exports = allReads;
