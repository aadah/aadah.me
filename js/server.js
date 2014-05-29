var express = require('express');
var mongo = require('mongodb');
var config = require('./config');

var app = express();
var db = new mongo.Db(config.db, new mongo.Server(config.dbhost, config.dbport));

app.post('/visit', function(req, res){
    var ip = req.get('x-real_ip');
    var collection = db.collection(config.visit);

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
    var collection = db.collection(config.post);

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
