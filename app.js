const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 7777;
const knex = require('./db/knex.js');
const path = require('path');

const events = require('./routes/events-routes');
const connections = require('./routes/connections-routes');
const profiles = require('./routes/profiles-routes');
const auth = require('./controllers/auth');

const bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
	res.redirect('/login.html');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/events', events);
app.use('/connections', connections);
app.use('/profiles', profiles);

app.set('view engine', 'ejs');

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

module.exports = app;
