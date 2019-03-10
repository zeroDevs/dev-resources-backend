const Contributor = require('../models/contributors.model');

const contribHandler = {};

contribHandler.create = ({ id, username, avatar, url, frontend, backend }) => {

    // Setup stuff
    const query = { username: username }
    const update = { id, username, avatar, url, frontend, backend }
    options = { upsert: true };

// Find the document
Contributor.findOneAndUpdate(query, update, options, function(error, result) {
if (!error) {
    // If the document doesn't exist
    if (!result) {
        // Create it
        result = new Contributor();
    }
    // Save the document
    result.save(function(error) {
        if (!error) {
            result.save()
            
            console.log("Success :P)")
        } else {
            console.log(id, username, avatar, url, contributions )
            throw error;
        }
    });
}
});



};
contribHandler.readAll = () => {

      return Contributor.find({})

  };
module.exports = contribHandler;
