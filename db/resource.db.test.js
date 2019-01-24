const mongoose = require('mongoose');
const assert = require('assert');
const Resource = require('../models/resource.model');
const resourceHandler = require('./resource.db');
const config = require('../config');

const seedResource = {
  link: 'https://www.google.com',
  author: {
    id: '1234567890',
    username: 'TestUser',
    discriminator: '1234'
  }
};

before(done => {
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(
      config.mongotesturl,
      { useNewUrlParser: true }
    )
    .then(() => {
      done();
    });
});

describe('resourceHandler - create()', () => {
  it('should create a new resource in the database on valid inputs', done => {
    resourceHandler
      .create(seedResource)
      .then(response => {
        if (response.error === false) {
          Resource.findOne({ link: seedResource.link }, (error, resource) => {
            assert.equal(resource.link, seedResource.link);
            assert.equal(resource.author.id, seedResource.author.id);
            done();
          });
        }
      })
      .catch(console.log);
  });
});

afterEach(done => {
  Resource.deleteMany({}, () => {
    done();
  });
});

after(done => {
  mongoose.connection.close().then(done);
});
