let passport    = require('../global').passport;
let bcrypt      = require('../global').bcrypt;
let fn          = require('../helper/functions');
let $database   = require('../database');

let LocalStrategy = require('../global').LocalStrategy;

let c_passport = {};

c_passport.serialize = (user, done) => {
  done(null, user.id);
};

c_passport.deserialize = (user, done) => {
  let sql = "SELECT * FROM members WHERE id = '" + user.id + "'";
  $database.con.query(sql, function (err, result, fields) {
    if (err) throw err;

    let data = {};

    data.id    = user.id;
    data.name  = user.name;
    data.email = user.email;

    done(err, data);
  });
};

c_passport.LocalStrategy = new LocalStrategy({
  usernameField     : 'email',
  passwordField     : 'password',
  passReqToCallback : true
}, (req, username, password, done) => {
  let sql = "SELECT * FROM members WHERE email = '" + username + "'";
  $database.con.query(sql, function (err, result, fields) {
    if (err) return done(err);
    if (!result.length) return done(null, false);
    else {
      bcrypt.compare(password, result[0].password, (err, res) => {
        if (!res) return done(null, false);
        else return done(null, result[0]);
      });
    }
  });
});

module.exports = c_passport;