var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function (req, res){
  Links.find({}).exec(function(links) {
    res.send(200, links.models);
  })
};


exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec(function(err, link) {
    if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits: 0
        });

        link.save(function(err, newLink) {
          if( err ){
            console.log('oops, an error');
            res.send(500, err);
          } else {
            console.log('Link saved: ');
            res.send(200, newLink);
          }
        });
      });
    }
  });
};


// exports.saveLink = function(req,res){
//   console.log('save links');
//   var uri = req.body.url;

//   if (!util.isValidUrl(uri)) {
//     console.log('Not a valid url: ', uri);
//     return res.send(404);
//   }

//   Link.findOne({ url:uri }).exec(function(err, link){
//     // if (err) { return res.send(500, err); }
//     if (link) {
//       console.log(link);
//       return res.send(200, link);
//     } else {
//       util.getUrlTitle(uri, function(err, title){
//         if (err) {
//           console.log('Error reading URL heading: ', err);
//           return res.send(404);
//         }

//         // Link.create({url:uri, title: title}, function(err, data){
//         //   if(err){
//         //     console.log('There is an error saving the link');
//         //     return res.send(500, err);
//         //   } else {
//         //     console.log('Link saved: ', data);
//         //     return res.send(200, data);
//         //   }
//         // })
//       })
//     }
//   })
// };


exports.navToLink = function(req, res) {
  console.log('navigate to link');

  Link.findOne({ code: req.params[0]  }).exec(function(err, link){
    if(err) { return res.send(500, err); }
    else {
      if (!link){
        res.redirect('/');
      } else {
        link.visits++;
        link.save().exec(function(){
          return res.redirect(link.url);
        });
      }
    }
  })
};

exports.signupUser = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  // instantiate new User
  // save new User with username, hashed password, userid

  User.findOne({username: username}).exec(function(user){
    if (!user){
      var newUser = new User({
        username: username,
        password: password});
      newUser.save(function(err, newUser){
        if (err){ res.send(500, err); }
        else {
          util.createSession(req, res, newUser);
        }
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  })
  // User.create({username: username, password: password}, function(err, data){
  //   if(err){
  //     console.log('There is an error');
  //   } else {
  //     console.log('User saved: ', data);
  //   }
  // })
  // User.
};

exports.loginUser = function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  console.log('looking for username: ', username)

  User.findOne({ username: username })
    .exec(function(err, user){
      console.log('found user: ',user);
      if (!user){
        console.log('no matching user found');
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match){
          if (match){
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
    })
};

// exports.saveLink = function(req, res) {
  // var uri = req.body.url;

  // if (!util.isValidUrl(uri)) {
  //   console.log('Not a valid url: ', uri);
  //   return res.send(404);
  // }

//   new Link({ url: uri }).fetch().then(function(found) {
//     if (found) {
//       res.send(200, found.attributes);
//     } else {
//       util.getUrlTitle(uri, function(err, title) {
//         if (err) {
//           console.log('Error reading URL heading: ', err);
//           return res.send(404);
//         }

//         var link = new Link({
//           url: uri,
//           title: title,
//           base_url: req.headers.origin
//         });

//         link.save().then(function(newLink) {
//           Links.add(newLink);
//           res.send(200, newLink);
//         });
//       });
//     }
//   });
// };

// exports.loginUser = function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;

//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         res.redirect('/login');
//       } else {
//         user.comparePassword(password, function(match) {
//           if (match) {
//             util.createSession(req, res, user);
//           } else {
//             res.redirect('/login');
//           }
//         })
//       }
//   });
// };

// exports.signupUser = function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;

//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         var newUser = new User({
//           username: username,
//           password: password
//         });
//         newUser.save()
//           .then(function(newUser) {
//             util.createSession(req, res, newUser);
//             Users.add(newUser);
//           });
//       } else {
//         console.log('Account already exists');
//         res.redirect('/signup');
//       }
//     })
// };

// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
// };
