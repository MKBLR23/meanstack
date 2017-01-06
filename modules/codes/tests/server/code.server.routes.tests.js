'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Code = mongoose.model('Code'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  code;

/**
 * Code routes tests
 */
describe('Code CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Code
    user.save(function () {
      code = {
        name: 'Code name'
      };

      done();
    });
  });

  it('should be able to save a Code if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Code
        agent.post('/api/codes')
          .send(code)
          .expect(200)
          .end(function (codeSaveErr, codeSaveRes) {
            // Handle Code save error
            if (codeSaveErr) {
              return done(codeSaveErr);
            }

            // Get a list of Codes
            agent.get('/api/codes')
              .end(function (codesGetErr, codesGetRes) {
                // Handle Codes save error
                if (codesGetErr) {
                  return done(codesGetErr);
                }

                // Get Codes list
                var codes = codesGetRes.body;

                // Set assertions
                (codes[0].user._id).should.equal(userId);
                (codes[0].name).should.match('Code name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Code if not logged in', function (done) {
    agent.post('/api/codes')
      .send(code)
      .expect(403)
      .end(function (codeSaveErr, codeSaveRes) {
        // Call the assertion callback
        done(codeSaveErr);
      });
  });

  it('should not be able to save an Code if no name is provided', function (done) {
    // Invalidate name field
    code.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Code
        agent.post('/api/codes')
          .send(code)
          .expect(400)
          .end(function (codeSaveErr, codeSaveRes) {
            // Set message assertion
            (codeSaveRes.body.message).should.match('Please fill Code name');

            // Handle Code save error
            done(codeSaveErr);
          });
      });
  });

  it('should be able to update an Code if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Code
        agent.post('/api/codes')
          .send(code)
          .expect(200)
          .end(function (codeSaveErr, codeSaveRes) {
            // Handle Code save error
            if (codeSaveErr) {
              return done(codeSaveErr);
            }

            // Update Code name
            code.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Code
            agent.put('/api/codes/' + codeSaveRes.body._id)
              .send(code)
              .expect(200)
              .end(function (codeUpdateErr, codeUpdateRes) {
                // Handle Code update error
                if (codeUpdateErr) {
                  return done(codeUpdateErr);
                }

                // Set assertions
                (codeUpdateRes.body._id).should.equal(codeSaveRes.body._id);
                (codeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Codes if not signed in', function (done) {
    // Create new Code model instance
    var codeObj = new Code(code);

    // Save the code
    codeObj.save(function () {
      // Request Codes
      request(app).get('/api/codes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Code if not signed in', function (done) {
    // Create new Code model instance
    var codeObj = new Code(code);

    // Save the Code
    codeObj.save(function () {
      request(app).get('/api/codes/' + codeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', code.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Code with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/codes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Code is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Code which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Code
    request(app).get('/api/codes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Code with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Code if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Code
        agent.post('/api/codes')
          .send(code)
          .expect(200)
          .end(function (codeSaveErr, codeSaveRes) {
            // Handle Code save error
            if (codeSaveErr) {
              return done(codeSaveErr);
            }

            // Delete an existing Code
            agent.delete('/api/codes/' + codeSaveRes.body._id)
              .send(code)
              .expect(200)
              .end(function (codeDeleteErr, codeDeleteRes) {
                // Handle code error error
                if (codeDeleteErr) {
                  return done(codeDeleteErr);
                }

                // Set assertions
                (codeDeleteRes.body._id).should.equal(codeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Code if not signed in', function (done) {
    // Set Code user
    code.user = user;

    // Create new Code model instance
    var codeObj = new Code(code);

    // Save the Code
    codeObj.save(function () {
      // Try deleting Code
      request(app).delete('/api/codes/' + codeObj._id)
        .expect(403)
        .end(function (codeDeleteErr, codeDeleteRes) {
          // Set message assertion
          (codeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Code error error
          done(codeDeleteErr);
        });

    });
  });

  it('should be able to get a single Code that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Code
          agent.post('/api/codes')
            .send(code)
            .expect(200)
            .end(function (codeSaveErr, codeSaveRes) {
              // Handle Code save error
              if (codeSaveErr) {
                return done(codeSaveErr);
              }

              // Set assertions on new Code
              (codeSaveRes.body.name).should.equal(code.name);
              should.exist(codeSaveRes.body.user);
              should.equal(codeSaveRes.body.user._id, orphanId);

              // force the Code to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Code
                    agent.get('/api/codes/' + codeSaveRes.body._id)
                      .expect(200)
                      .end(function (codeInfoErr, codeInfoRes) {
                        // Handle Code error
                        if (codeInfoErr) {
                          return done(codeInfoErr);
                        }

                        // Set assertions
                        (codeInfoRes.body._id).should.equal(codeSaveRes.body._id);
                        (codeInfoRes.body.name).should.equal(code.name);
                        should.equal(codeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Code.remove().exec(done);
    });
  });
});
