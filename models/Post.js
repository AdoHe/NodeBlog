var mongodb = require('./db');

function Post(user, content, time) {
	this.user = user;
	this.content = content;
	if(time) {
		this.time = time;
	}else {
		this.time = new Date();
	}
}

module.exports = Post;

Post.prototype.save = function save(callback) {
	//待插入的mongodb文档
	var post = {
		user: this.user,
		content: this.content,
		time: this.time,
	};

	//open the database connection
	mongodb.open(function (err, db) {
		if(err) {
			return callback(err);
		}

		//fetch the posts collection
		db.collection('posts', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			
			//add index for the user field
			collection.ensureIndex('user');
	
			collection.insert(post, {safe: true}, function(err, result) {
				mongodb.close();
				callback(err, result);
			});
		});
	});
};

Post.get = function(username, callback) {
	//open the database connection
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		//fetch the posts collection
		db.collection('posts', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}

			var query = {};
			if(username) {
				query.user = username;
			}

			collection.find(query).sort([['time', -1]]).toArray(function(err, docs) {
				mongodb.close();
				if(err) {
					callback(err, null);
				}

				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.content, doc.time);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};
