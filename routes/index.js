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
		var username = request.body.username;
		var password = request.body.password;
		var passwordAck = request.body.passwordAck;
		
		if(username.length == 0) {
			request.flash('error', '请输入用户名');
			return response.redirect('/reg');
		}

		if(password != passwordAck) {
			request.flash('error', '两次输入的密码不一致');
			return response.redirect('/reg');
		}
		
		var md5 = crypto.createHash('md5');
		var pwd = md5.update(password).digest('base64');

		var newUser = new User({
			name: username,
			password: pwd
		});

		User.get(username, function(err, user) {
			if(user)
				err = "用户名以存在";
			if(err) {
				request.flash('error', err);
				return response.redirect('/reg');
			}

			newUser.save(function(err) {
				if(err) {
					request.flash('error', err);
					return response.redirect('/reg');
				}

				request.session.user = newUser;
				request.flash('success', '注册成功');
				response.redirect('/');
			});
		});
	});

	//user login
	app.post('/login', function(request, response) {
		var username = request.body.username;
		var password = request.body.password;

		if(username == null || username == "") {
			request.flash('error', '请输入你的用户名');
			response.redirect('/login');
		}

		if(password == null || password == "") {
			request.flash('error', '请输入你的密码');
			response.redirect('/login');
		}

		var md5 = crypto.createHash('md5');
		var pwd = md5.update(password).digest('base64');

		User.get(username, function(err, user) {
			if(!user) {
				request.flash('error', '该用户不存在');
				return response.redirect('/login');
			}

			request.session.user = user;
			request.flash('success', '登录成功');
			response.redirect('/');
		});
	});
}
