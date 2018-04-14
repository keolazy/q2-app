const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 7777;
const knex = require('./db/knex.js');

const events = require('./routes/events');
const connections = require('./routes/connections');
const profiles = require('./routes/profiles');

const bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/events', events);
app.use('/connections', connections);
app.use('/profiles', profiles);

app.set('view engine', 'ejs');

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

module.exports = app;
