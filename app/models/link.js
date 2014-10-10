// Main purpose of the link model file is to export a user model.
var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  url: String,
  title: String,
  visits: {type : Number, default : 0},
  link: String,
  code: String,
  base_url: String
});

var Link = mongoose.model('Link', linkSchema);

linkSchema.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0,5);
  console.log('here is my code: ', this.code);
  next();
});


module.exports = Link;

