const express = require('express');
const app = express();

const indexRouter = require('./routes/index.js');

const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Application is working at ${port}`);
});