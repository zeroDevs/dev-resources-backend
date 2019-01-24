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

describe('resourceHandler - read()', () => {
  it('should return resources provided in inputs', done => {
    done();
  });
});

describe('resourceHandler - readAll()', () => {
  it('should return all resources', done => {
    done();
  });
});

describe('resourceHandler - updateLink()', () => {
  it('should update an existing link on valid input', done => {
    done();
  });
});

describe('resourceHandler - updateAuthor()', () => {
  it('should update the author of an existing link on valid input', done => {
    done();
  });
});

describe('resourceHandler - delete()', () => {
  it('should delete an existing resource on valid link', done => {
    done();
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
