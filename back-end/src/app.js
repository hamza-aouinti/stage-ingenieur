var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const sequelize = require('./config/sequelize')
const dotenv = require("dotenv");
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var permissionsRouter = require('./routes/permissions');
var authRouter = require('./routes/auth');
var projectRouter= require('./routes/project')
var phaseRouter= require('./routes/phase')
var taskRouter= require('./routes/task')
var trailRouter= require('./routes/trail')

var app = express();

app.use(
  cors({
    origin: ["http://localhost:4200","http://localhost:8081"],
    credentials: true,
  })
)

// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    " Content-Type"
  );

  next();
});
//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/role', rolesRouter);
app.use('/permission',permissionsRouter)
app.use('/auth', authRouter)
app.use('/project', projectRouter)
app.use('/phase', phaseRouter)
app.use('/task', taskRouter)
app.use('/trail', trailRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
