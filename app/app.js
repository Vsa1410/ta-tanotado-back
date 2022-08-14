require("../config/database")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')


var notesRouter = require('../routes/notes');
var usersRouter = require('../routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/notes', notesRouter);//Routes to notes
app.use('/users', usersRouter);// Routes to users

module.exports = app;
