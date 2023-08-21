const createError = require('http-errors');
const express = require('express');
const cors = require('cors');

const searchRouter = require('./routes/searchRouter');
const browseRouter = require('./routes/browseRouter');
const profileRouter = require('./routes/profileRouter');
const downloadRouter = require('./routes/downloadRouter');
const miscRouter = require('./routes/miscRouter');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.text());
app.use(cors({ origin: '*' }));

app.use('/search', searchRouter);
app.use('/browse', browseRouter);
app.use('/profile', profileRouter);
app.use('/download', downloadRouter);
app.use('/misc', miscRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
