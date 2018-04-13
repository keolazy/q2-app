const express = require('express');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 7777;

const bodyParser = require('body-parser');
const ejs = require('ejs');


app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');









app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})

module.exports = app;
