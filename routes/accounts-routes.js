const express = require("express");
const router = express.Router({ mergeParams: true });
const knex = require("../db/knex");
const methodOverride = require("method-override");

// return user's account info from users table
router.get("/", (req, res, next) => {
  if (req.session.user) {
    knex("users")
      .where("id", req.session.user)
      .select("*")
      .then(accounts => {
        res.render("accounts", { accounts: accounts });
      });
  } else {
    res.redirect("accounts/view", { accounts });
  }
});
