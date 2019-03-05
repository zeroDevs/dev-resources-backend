const dbhandler = require('../db/resource.db');
const escp = require('../utils').escapeString;
const stopword = require('stopword');

const allReads = async () => {
    const x = await dbhandler.readAll();
    let allTopicArr = x.payload.resources.map(e =>
        stopword.removeStopwords(escp(e.meta.title).split(/\s+/)).join()
    );


    let allTopics = allTopicArr.map((topic) => {
        return letterPairs(topic)
    })

    console.log(allTopics);
}

const letterPairs = (topic) => {
    let len = topic.length - 1;
    let pairs = [];
    for (let i = 0; i < len; i++) {
        pairs[i] = topic.substring(i, i + 2);
    }

    return pairs;
}

module.exports = allReads;
