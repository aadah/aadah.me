var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');

var app = express();
var db = new mongo.Db(config.db, new mongo.Server(config.dbhost, config.dbport));

// TODO: Set up dynamic loading on blog page.
//var blog_router = express.Router();
//var retrieve_load = 1;

var root = path.resolve(__dirname + '/..');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(config.check(root));

app.post('/visit', function(req, res) {
	var ip = req.get('x-real_ip');
	var collection = db.collection(config.visitors);

	collection.find({ip: ip}).count(function(err, count) {
		if (!err) {
			if (count) {
				collection.update({ip: ip}, {$inc: {views: 1},
											 $set: {last: req.param('last')}});
			}
			else {
				var doc = {ip: ip,
						   views: 1, // first view for this ip
						   last: req.param('last')};
				collection.insert(doc);
			}
			res.send(200);
		}
		else {
			console.log(err);
			res.send(500);
		}
	});
});

app.post('/post', function(req, res) {
	var collection = db.collection(config.entries);

	collection.find({dir: req.param('dir')}).count(function(err, count) {
		if (!err) {
			if (count) {
				collection.update({dir: req.param('dir')}, {$inc: {views: 1}});
			}
			else {
				var doc = {title: req.param('title'),
						   subtitle: req.param('subtitle'),
						   author: req.param('author'),
						   posted: req.param('posted'),
						   views: 1, // first view for this post
						   dir: req.param('dir')};
				collection.insert(doc);
			}
			res.send(200);
		}
		else {
			console.log(err);
			res.send(500);
		}
	});
});

//blog_router.get('/init', function() {
//	var collection = db.collection(config.entries);
//
//	collection.find().count(function(err, count) {
//		if (!err) {
//			res.send(200);
//		}
//		else {
//			console.log(err);
//			res.send(500);
//		}
//	});
//});

port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log('Listening on port', port);

	db.open(function(err, db) {
		if (err) {
			console.log('Error opening db . . .');
			db.close();
		}
	});
});
