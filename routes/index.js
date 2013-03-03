/*module.exports = function(app) {
	//nav to the index page
	app.get('/', function(request, response) {
		response.render('index', {title: 'Express'});
	});

	//called when visit the reg page
	app.get('/reg', function(request, response) {
		response.render('reg', {title: '用户注册'});
	});

	//called when the reg button is clicked
	app.post('/reg', function(request, response) {

	});

	//nav to the login page
	app.get('/login', function(request, response) {
		response.render('login', {title: '用户登录'});
	});
};*/

/*exports.index = function(request, response) {
	response.render('index', {title: 'Express'});
	//throw new Error('An error for test purpose');
};

exports.reg = function(request, response) {
	response.render('reg', {title: '用户注册'});
};

exports.doReg = function(request, response) {
	if(request.body['password-ack'] != request.body['password'])
	{
		//request.flash('error', '两次输入的密码不一致!');
		return response.redirect('/reg');
	}
};

exports.login = function(request, response) {
	response.render('login', {title: '用户登录'});
};*/
var crypto = require('crypto');
var User = require('../models/User');

module.exports = function(app) {
	//nav to the index page
	app.get('/', function(request, response) {
		response.render('index', {title: 'Express', error: request.flash('error'),});
	});

	//nav to the reg page
	app.get('/reg', function(request, response) {
		response.render('reg', {title: '用户注册'});
	});

	//nav to the login page
	app.get('/login', function(request, response) {
		response.render('login', {title: '用户登录'});
	});

	//user reg
	app.post('/reg', function(request, response) {

	});

	//user login
	app.post('/login', function(request, response) {
		var username = request.body.username;

		if(username == null || username == "") {
			request.flash('error', '请输入你的用户名');
			response.redirect('/login');
		}
	});
}
