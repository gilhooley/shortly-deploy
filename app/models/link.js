// Main purpose of the link model file is to export a user model.
var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = new mongoose.Schema({ url: 'string', visits: 'number', shortUrl: 'string' });
var Link = mongoose.model('Link', linkSchema);

// Link.methods.initialize = function(){};


module.exports = Link;





// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
