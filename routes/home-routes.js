const express = require("express");
const router = express.Router({ mergeParams: true });
const knex = require("../db/knex");
const profiles = require("./profiles-routes");
const methodOverride = require("method-override");

// Get all user's Events
// router.get("/", (req, res) => {
//   if (req.session.user) {
//     knex("users_events")
//       .where("user_id", req.session.user)
//       .innerJoin("events", "users_events.event_id", "events.id")
//       .select(
//         "users_events.id",
//         "users_events.user_id",
//         "users_events.event_id",
//         "events.name",
//         "events.description",
//         "events.location",
//         "events.date",
//         "events.start_time",
//         "events.end_time"
//       )
//       .then(users_events => {
//         res.render("events/homeTest", { users_events: users_events });
//       });
//   } else {
//     req.session.message = {
//       type: "error",
//       text: "You must be logged in to view event profiles."
//     };
//     console.log(`Setting req session message to: ${req.session.message.text}`);
//     res.redirect("/login");
//   }
// });

router.use((req, res, next) => {
  req.session.returnToPrev = req.session.returnTo;
  req.session.returnTo = req.originalUrl;
  next();
});

router.use("/", (req, res, next) => {
  console.log(`Session user id is: ${res.locals.user}`);
  if (res.locals.user) {
    next();
  } else {
    req.session.message = {
      type: "error",
      text: "You must be logged in to view event profiles."
    };
    res.redirect("/login");
  }
});

router.get("/", (req, res, next) => {
  let profileHero = knex("users_events")
    .where("event_id", req.session.user)
    .innerJoin("users", "users_events.user_id", "users.id")
    .select({
      userID: "users.id",
      userFirst: "users.first",
      userLast: "users.last",
      profileID: "users_events.id",
      profileQuestions: "users_events.questions",
      profileTopics: "users_events.topics",
      profileJob: "users_events.job_status",
      profileNoise: "users_events.noise_level",
      profileWhereToFind: "users_events.where_to_find",
      profileAskMe: "users_events.ask_me",
      profilePersonality: "users_events.personality"
    });

  let rsvpCount = knex("users_events")
    .where("host_id", res.locals.user)
    .count("users_events");

  let hostingCount = knex("events")
    .where("host_id", res.locals.user)
    .count("events");

  let connectionCount = knex("connections")
    .where("mutual", true)
    .count();
});

module.exports = router;
