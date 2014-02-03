var express = require('express');
var mongo = require('mongodb');
var config = require('./config');

var app = express();
var db = new mongo.Db(config.db, new mongo.Server(config.dbhost, config.dbport));

app.use(express.bodyParser());

app.post('/home', function(req, res){
    if (!config.valid(req)) {
        return res.send(404);
    }
    
    var ip = req.get('x-real_ip');
    
    db.open(function(err, db) {
        if (!err) {
            var collection = db.collection(config.home);
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
                    db.close();
                }
                else {
                    console.log(err);
                    db.close();
                }
            });
        }
        else {
            console.log(err);
            db.close();
        }
    });
});

app.post('/visit', function(req, res) {
    if (!config.valid(req)) {
        return res.send(404);
    }
    
    db.open(function(err, db) {
        if (!err) {
            var collection = db.collection(config.visit);
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
                    db.close();
                }
                else {
                    console.log(err);
                    db.close();
                }
            });
        }
        else {
            console.log(err);
            db.close();
        }
    });
});

port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on port', port);
});
