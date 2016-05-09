// usage: node cli.js path/to/manuscript [-u] [-p] [-s] [-h] [-r]

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var minimist = require('minimist');

var config = require('./utils/config');
var publisher = require('./utils/publisher');

var args = minimist(process.argv.slice(2));
var file = path.resolve(args._[0]);
var manuscript = fs.readFileSync(file, 'utf-8');
var dir = path.basename(file, path.extname(file));

var func;
func = args.u ? publisher.update : func;
func = args.p ? publisher.publish : func;
func = args.s ? publisher.show : func;
func = args.h ? publisher.hide : func;
func = args.r ? publisher.remove : func;

mongoose.connect(config.db_connection_string);

function callback(err) {
    if (err) {
        console.log('Error:', err);
    }
    mongoose.connection.close();
}

func(dir, callback, manuscript);
