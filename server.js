/**
 * Created by chassiness on 4/6/15.
 */

// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

var passport       = require('passport');
var flash          = require('connect-flash');

var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var path           = require('path');
// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url);

require('./config/passport')(passport); // pass passport for configuration

//set up express
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));



app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
// required for passport
app.use(session({ secret: 'samplesessionsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

// set the static files location /public/img will be /img for users
// =============================================================================
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app, passport); // configure our routes //++ pass in our app and fully configured passport

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;