const mongoose = require('mongoose');
const assert = require('assert');
const Resource = require('../models/resource.model');
const resourceHandler = require('./resource.db');
const resourceSeed = require('../seeds/resources.seed');

before(done => {
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true }
    )
    .then(() => {
      done();
    });
});

describe('resourceHandler - create()', () => {
  it('should create a new resource in the database on valid inputs', done => {
    resourceHandler
      .create(resourceSeed[0])
      .then(response => {
        if (response.error === false) {
          Resource.findOne(
            { link: resourceSeed[0].link },
            (error, resource) => {
              assert.equal(resource.link, resourceSeed[0].link);
              assert.equal(resource.author.id, resourceSeed[0].author.id);
              done();
            }
          );
        }
      })
      .catch(console.log);
  });
});

describe('resourceHandler - read()', () => {
  it('should return resources provided in inputs', done => {
    Promise.all(
      resourceSeed.splice(0, 5).map(seed => {
        return resourceHandler.create(seed);
      })
    ).then(() => {
      resourceHandler.read({ pageNumber: 2, limit: 2 }).then(response => {
        assert.equal(response.payload.resources.length, 2);
        done();
      });
    }).catch(err => console.error(err));
    done();
  }).timeout(10000);
});

describe('resourceHandler - readAll()', () => {
  it('should return all resources', done => {
    Promise.all(
      resourceSeed.splice(0, 5).map(seed => {
        return resourceHandler.create(seed);
      })
    )
      .then(() => {
        resourceHandler.readAll().then(response => {
          assert.equal(response.payload.resources.length, 5);
          assert.equal(typeof response.payload.resources[0].link, 'string');
          assert.equal(typeof response.payload.resources[1].link, 'string');
          assert.equal(typeof response.payload.resources[2].link, 'string');
          assert.equal(typeof response.payload.resources[3].link, 'string');
          assert.equal(typeof response.payload.resources[4].link, 'string');
          assert.equal(
            typeof response.payload.resources[0].author.id,
            'string'
          );
          assert.equal(
            typeof response.payload.resources[1].author.id,
            'string'
          );
          assert.equal(
            typeof response.payload.resources[2].author.id,
            'string'
          );
          assert.equal(
            typeof response.payload.resources[3].author.id,
            'string'
          );
          assert.equal(
            typeof response.payload.resources[4].author.id,
            'string'
          );
          done();
      });
  }).catch(err => console.error(err));
  done();
  }).timeout(10000);
});

describe('resourceHandler - updateLink()', () => {
  it('should update an existing link on valid input', done => {
    resourceHandler.create(resourceSeed[0]).then(() => {
      resourceHandler
        .updateLink({
          oldLink: resourceSeed[0].link,
          newLink: resourceSeed[1].link
        })
        .then(() => {
          Resource.find({ link: resourceSeed[1].link }).exec(
            (error, resources) => {
              assert.equal(resources.length, 1);
              done();
            }
          );
        });
    });
  }).timeout(5000);
});

describe('resourceHandler - updateAuthor()', () => {
  it('should update the author of an existing link on valid input', done => {
    resourceHandler.create(resourceSeed[0]).then(() => {
      resourceHandler
        .updateAuthor({
          link: resourceSeed[0].link,
          author: resourceSeed[1].author
        })
        .then(() => {
          Resource.find({ author: resourceSeed[1].author }).exec(
            (error, resources) => {
              assert.equal(resources.length, 1);
              done();
            }
          );
        });
    });
  }).timeout(5000);
});

describe('resourceHandler - delete()', () => {
  it('should delete an existing resource on valid link', done => {
    resourceHandler.create(resourceSeed[0]).then(() => {
      resourceHandler.delete(resourceSeed[0].link).then(() => {
        Resource.find({ link: resourceSeed[0].link }).exec(
          (error, resources) => {
            assert.equal(resources.length, 0);
            done();
          }
        );
      });
    });
  }).timeout(5000);
});

afterEach(done => {
  Resource.deleteMany({}, () => {
    done();
  });
});

after(done => {
  mongoose.connection.close().then(done);
});
