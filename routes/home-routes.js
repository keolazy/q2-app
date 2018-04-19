const express = require("express");
const router = express.Router({ mergeParams: true });
const knex = require("../db/knex");
const profiles = require("./profiles-routes");
const methodOverride = require("method-override");

// Get all user's Events
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
        "events.end_time"
      )
      .then(users_events => {
        res.render("events/homeTest", { users_events: users_events });
      });
  } else {
    req.session.message = {
      type: "error",
      text: "You must be logged in to view event profiles."
    };
    console.log(`Setting req session message to: ${req.session.message.text}`);
    res.redirect("/login");
  }
});
module.exports = router;
