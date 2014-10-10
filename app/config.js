//Main purpose of the config file is to establish connection to the db and export it.

var mongoose = require('mongoose'); //import mongoose

mongoose.connect('mongodb://localhost/shortlydb'); //connect mongoose to test

var db = mongoose.connection; //establish that connection and save to db

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('connection oepn')
});

module.exports = db;  //export db.







