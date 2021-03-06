const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 7777;
const knex = require('./db/knex.js');
const path = require('path');
const session = require('express-session');

const events = require('./routes/events-routes');
const connections = require('./routes/connections-routes');
const profiles = require('./routes/profiles-routes');
const account = require('./routes/accounts-routes');
const labs = require('./routes/lab-routes');
const home = require('./routes/home');

const auth = require('./controllers/auth');
const signup = require('./controllers/signup');

const bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: `zubair's revenge`, cookie: {} }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.locals.user = req.session.user;
	console.log(`Res.locals.user set to: ${res.locals.user}`);
	next();
});

app.get('/login', (req, res) => {
	let theMessage = req.session.message;
	req.session.message = {};
	res.render('login', { message: theMessage });
});

app.get('/logout', (req, res) => {
	req.session.destroy(err => {
		if (err) {
			res.status(400).send(err);
		} else {
			res.redirect('/login');
		}
	});
});

app.get('/', (req, res) => {
	if (res.locals.user) {
		res.redirect('/home');
	} else {
		res.render('landing');
	}
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.use('/auth', auth);
app.use('/signup', signup);
app.use('/events', events);
app.use('/connections', connections);
app.use('/profiles', profiles);
app.use('/account', account);
app.use('/labs', labs);
app.use('/home', home);

app.set('view engine', 'ejs');

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

module.exports = app;
