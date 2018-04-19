const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const methodOverride = require('method-override');
const cors = require('cors');
const serveStatic = require('serveStatic');



// router.get('https://www.eventbriteapi.com/v3/users/me/?token=R35L6HN4MS7M53LVFZN2', (req, res) => {
//   res.send('done')
// })

module.exports = router;
