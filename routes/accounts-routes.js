const express = require("express");
const router = express.Router({ mergeParams: true });
const knex = require("../db/knex");
const methodOverride = require("method-override");

// return user's account info from users table
router.get("/", (req, res) => {
  knex("users")
    .where("id", req.session.user)
    .select("*")
    .then(data => {
      // res.send("Hopefully no error");
      res.render("account/view", { user: data });
    })
    .catch(error => {
      res.send("didn not render");
    });
});

module.exports = router;
