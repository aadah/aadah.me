// usage: node cli.js path/to/manuscript -[s|p|r|h|d]

var path = require('path')
var fs = require('fs')
var mongoose = require('mongoose')
var minimist = require('minimist')

var config = require('./utils/config')
var publisher = require('./utils/publisher')

var args = minimist(process.argv.slice(2))

var func
func = args.s ? publisher.save : func
func = args.p ? publisher.publish : func
func = args.r ? publisher.reveal : func
func = args.h ? publisher.hide : func
func = args.d ? publisher.delete : func

try {
  var file = path.resolve(args._[0])
  var manuscript = fs.readFileSync(file, 'utf-8')
  var dir = path.basename(file, path.extname(file))
} catch (err) {
  console.log('No file path given.')
}

mongoose.connect(config.db_connection_string)

function callback (err) {
  if (err) {
    console.log('Error:', err)
  }
  mongoose.connection.close()
}

func(dir, callback, manuscript)
