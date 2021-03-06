// MODULES
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var passport= require('passport');
var flash = require('connect-flash');

// CONFIGURATION
var port = process.env.PORT || 8080;

var db = require('./config/db');
mongoose.connect(db.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public')
app.set('json spaces', 4);

app.use(session({
    secret: 'lizzardrules',
    store: new MongoStore({'db': 'sessions'})
  }));

app.use( function (req, res, next) {
	if ( req.method == 'POST' && req.url == '/login' ) {
		if ( req.body.rememberme ) {
			req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
		} else {
			req.session.cookie.expires = false;
		}
	}
	next();
});


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ROUTES
require('./app/routes/site')(app, passport);
var api = require('./app/routes/api-site');
var admin = require('./app/routes/api-admin');

app.use('/api', api);
app.use('/api/admin', admin);

app.listen(port);
console.log('The magic happens on port ' + port);