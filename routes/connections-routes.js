const express = require("express");
const router = express.Router();
const knex = require("../db/knex");
const bodyParser = require("body-parser");

router.get("/", (req, res) => {
  knex("connections")
    .select("*")
    .then(connections => {
      res.send(connections);
    });
});

router.get("/:id", (req, res) => {
  knex("connections")
    .where("id", req.params.id)
    .then(connection => {
      res.json(connection);
    });
});

router.post("/", (req, res) => {
  knex("connections")
    .insert(req.body)
    .then(() => {
      res.redirect("/connections");
    });
});

router.delete("/:id", (req, res) => {
  knex("connections")
    .where("id", req.params.id) // returns array
    .first()
    .del()
    .then(() => {
      res.redirect("/connections");
    });
});

module.exports = router;
