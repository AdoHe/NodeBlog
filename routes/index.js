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
var Post = require('../models/Post');

module.exports = function(app) {
	//nav to the index page
	app.get('/', function(request, response) {
		Post.get(null, function(err, posts) {
			if(err) {
				posts = [];
			}

			response.render('index', {
				title: '用户首页',
				posts: posts,
			});
		});
	});

	//nav to the reg page
	app.get('/reg', function(request, response) {
		response.render('reg', {title: '用户注册'});
	});

	//nav to the login page
	app.get('/login', checkLogin); 
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
			
			if(user.password != pwd) {
				request.flash('error', '你输入的密码不正确');
				return response.redirect('/login');
			}

			request.session.user = user;
			request.flash('success', '登录成功');
			response.redirect('/');
		});
	});

	//user logout
	app.get('/logout', function(request, response) {
		request.session.user = null;
		request.flash('success', '登出成功');
		response.redirect('/');
	});
	
	//user post a blog
	app.post('/post', checkNotLogin);
	app.post('/post', function(request, response) {
		var currentUserName = request.session.user.name;
		var newPost = new Post(currentUserName, request.body.post);
		newPost.save(function(err) {
			if(err) {
				request.flash('error', err);
				return response.redirect('/');
			}

			request.flash('success', '发表博文成功');
			response.redirect('/u/' + currentUserName);
		});
	});

	//nav to personal page
	app.get('/u/:username', function(request, response) {
		var username = request.params.username;

		User.get(username, function(err, user) {
			if(!user) {
				request.flash('error', 'Still not login');
				return response.redirect('/');
			}

			Post.get(user.name, function(err, posts) {
				if(err) {
					request.flash('error', err);
					return response.redirect('/');
				}

				response.render('user', {
					title: '',
					posts: posts,
				});
			});
		});
	});

	//check whether login
	function checkLogin(request, response, next) {
		if(request.session.user) {
			request.flash('error', '已登入');
			return response.redirect('/');
		}else {
			next();
		}
	}

	//check wheter not login
	function checkNotLogin(request, response, next) {
		if(!request.session.user) {
			request.flash('error', '未登入');
			return response.redirect('/login');
		}

		next();
	}
}
