const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const methodOverride = require('method-override');
const cors = require('cors');
const fs = require('fs');

router.get('/', (req, res) => {
  res.redirect('https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=BFJKNNGLDIDQ52ADJ5A4')
})

// router.get('/', (req, res) => {
//   fs.readFile('./views/labs/lab.html', 'utf8', (err, data) => {
//     if(err) {
//       console.error(err);
//     } else {
//       res.send(data);
//     }
//   })
// })

module.exports = router;
