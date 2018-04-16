const chai = require("chai");
const expect = chai.expect;
const app = require("../app.js");
const request = require("supertest")(app);
const knex = require("../db/knex.js");

app.set("env", "test");
app.listen(8000);

let users = knex("users").select("*");
let events = knex("events").select("*");
let connections = knex("connections").select("*");
let users_events = knex("users_events").select("*");

// describe('This is a sample test', () => {
// 	it('And it should pass', () => {
// 		expect(true).to.equal(true);
// 	});
// });

describe(`/events`, () => {
  it(`Returned events should include ALL events`, done => {
    request
      .get("/events")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        events
          .then(events => {
            expect(response.body.length).to.equal(events.length);
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });
  it(`First event returned should be first event from DB`, done => {
    request
      .get("/events")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        events
          .then(events => {
            expect(response.body[0].description).to.equal(
              events[0].description
            );
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });
  it(`Last event returned should be last event from DB`, done => {
    request
      .get("/events")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        events
          .then(events => {
            let lastIndex = events.length - 1;
            expect(response.body[lastIndex].description).to.equal(
              events[lastIndex].description
            );
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });
});

describe(`/connections`, () => {
  it(`Returned connections should include ALL connections`, done => {
    request
      .get("/connections")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        connections
          .then(connections => {
            expect(response.body.length).to.equal(connections.length);
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });
  it(`First connection returned should be first connection from DB`, done => {
    request
      .get("/connections")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        connections
          .then(connections => {
            expect(response.body[0].user_id_friend).to.equal(
              connections[0].user_id_friend
            );
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });
  it(`Last connection returned should be last connection from DB`, done => {
    request
      .get("/connections")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        connections
          .then(connections => {
            let lastIndex = connections.length - 1;
            expect(response.body[lastIndex].user_id_owner).to.equal(
              connections[lastIndex].user_id_owner
            );
            done();
          })
          .catch(err => {
            done(err);
          });
      })
      .catch(err => {
        done(err);
      });
  });
  it("should delete an item off collections array", done => {
    let hexId = connections[0].id.toHexString(); // 1
    request
      .delete(`/connections/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.connections.id).toBe(hexId);
      })
      .end((err, res) => {
        // any error encountered, it is returned.
        if (err) {
          return done(err);
        }
      });

    // if no error, test goes further to query db
    Connections.findById(hexId)
      .then(todo => {
        expect(connections.hexId).toNotExist(); // using the ID saved as value of hexID. test expects the matching id to not exist
        done();
      })
      .catch(e => done(e));
  });

  // it("should return 404 if a connection is not found", done => {
  //   let hexId = new ObjectId().toHexString();
  //   request
  //     .delete(`/coneccctions/${connections / hexId}`)
  //     .expect(404)
  //     .end(done);
  // });
  //
  // it("should return 404 for non-object ids", done => {
  //   request
  //     .delete("/connections/abc123")
  //     .expect(404)
  //     .end(done);
  // });
});
