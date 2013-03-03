var express = require('express');
var routes = require('./routes');
var fs = require('fs');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var partials = require('express-partials');

var app = module.exports = express();

var accessLogFile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogFile = fs.createWriteStream('error.log', {flags: 'a'});

//configure some detail information about app
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	
	app.use(express.logger({stream: accessLogFile}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('My Cookie'));
	app.use(express.session({
		secret: settings.cookieSecret,
		store: new MongoStore({
			db: settings.db
			})
		}));
	app.use(flash());
	app.use(partials());
	app.use(express.static(__dirname + '/public'));
	app.use(function (request, response, next) {
		var err = request.flash('error') || 'error';

		response.locals.error = err;
		next();
	});

	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
	app.error(function(error, request, response, next) {
		var meta = '[' + new Date() + ']' + request.url + '\n';
		errorLogFile.write(meta + error.stack + '\n');
		next();
	});
});


if(!module.parent)
{
	app.listen(3000);
	console.log('The server started at port 3000');
}

routes(app);
