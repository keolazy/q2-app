const express = require("express");
const router = express.Router({ mergeParams: true });
const knex = require("../db/knex");
const methodOverride = require("method-override");

// return user's account info from users table
router.get("/", (req, res) => {
  knex("users")
    .where("id", req.session.user)
    .select("*")
    .first()
    .then(data => {
      console.log(data);
      res.render("account/view", { user: data });
    })
    .catch(error => {
      res.send("didnt render");
    });
});

router.get("/edit", (req, res) => {
  knex("users")
    .select("*")
    .where("id", req.session.user)
    .first()
    .then(data => {
      res.render("account/edit", { user: data });
    })
    .catch(error => {
      res.send(error);
    });
});

// router.put("/edit", (req, res) => {
//   knex("events").where();
// });

module.exports = router;