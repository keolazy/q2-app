const express = require("express");
const router = express.Router({ mergeParams: true });
const knex = require("../db/knex");
const profiles = require("./profiles-routes");
const methodOverride = require("method-override");
// const bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:true}));

// Should only return events that user is attending.
router.get("/", (req, res) => {
  if (req.session.user) {
    knex("users_events")
      .where("user_id", req.session.user)
      .innerJoin("events", "users_events.event_id", "events.id")
      .select(
        "users_events.id",
        "users_events.user_id",
        "users_events.event_id",
        "events.name",
        "events.description",
        "events.location",
        "events.date",
        "events.start_time",
        "events.end_time",
        "events.host_id"
      )
      .then(user_events => {
        // res.render("home.ejs");
        res.send(user_events);
      });
  } else {
    res.redirect("/");
  }
});

// Return all events
router.get("/all", (req, res) => {
  if (req.session.user) {
    knex("events")
      .select("*")
      .then(events => {
        if (events) {
          res.send(events);
        } else {
          res.send("Connection invalid");
        }
      })
      .catch(error => {
        console.log("Finding Connection Error:", error);
        res.send(error);
      });
  } else {
    res.redirect("/");
  }
});

// Returns single event. No attendees
router.get("/:id", (req, res) => {
  knex("events")
    .select("*")
    .where({ id: req.params.id })
    .then(event => {
      res.send(event);
    });
});

router.get("/:id/edit", (req, res) => {
  knex("events")
    .select("*")
    .where({ id: req.params.id })
    .then(oneEvent => {
      res.render("../views/editEvent", { oneEvent: oneEvent });
      console.log(oneEvent);
    });
});

router.put("/:id/edit", (req, res) => {
  router.use(methodOverride("application/x-www-form-urlencoded"));
  knex("events")
    .where({ id: req.params.id })
    .update({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      host_id: req.body.host_id
    })
    .then(() => {
      res.send("you just updated the event");
      console.log(req.body.name);
    });
});

router.use("/:id/profiles", profiles);

router.post("/", (req, res) => {
  knex("events")
    .insert({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.start_time,
      host_id: req.body.host_id
    })
    .then(result => {
      res.send(result);
    });
});
router.patch("/:id", (req, res) => {
  knex("events")
    .where({ id: req.params.id })
    .update({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.start_time,
      host_id: req.body.host_id
    })
    .then(() => {
      res.send("dang fool");
    });
});
router.delete("/:id", (req, res) => {
  knex("events")
    .where({ id: req.params.id })
    .del()
    .then(() => {
      res.send("party times over");
    });
});

module.exports = router;
