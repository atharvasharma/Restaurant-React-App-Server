const express = require('express'),
     http = require('http');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var cookieParser=require('cookie-parser');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

app.use(passport.initialize());
app.use(passport.session());



const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const usersRouter = require('./routes/users');

const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/dishes', dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/users', usersRouter);

app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));






const hostname = 'localhost';
const port = 3000;
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});