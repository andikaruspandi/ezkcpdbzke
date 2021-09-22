let passport  = require('../global').passport;
let bcrypt    = require('../global').bcrypt;
let fn        = require('../helper/functions.js');
let $database = require('../database');
let { validationResult } = require('../global').validator;

let c_auth = {};

c_auth.gateway = (req, res) => {
  res.render('auth/gateway');
};

c_auth.login = (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    // A error also means, an unsuccessful login attempt
    let handler = (errors) => {
      req.flash('old', { 'login': req.body.email });
      console.log(errors);

      for (let error of errors) req.flash('error', error);

      return res.redirect(301, '/gateway');
    };

    if (error) handler(error);
    console.log(user);
    if (!user) handler(['Email or password does not match!']);
    else {
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        
        return res.redirect(301, '/dashboard');
      });
    }
  })(req, res, next);
};

c_auth.register = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let handler = (errors) => {
    req.flash('old', {
      'name'  : req.body.name,
      'email' : req.body.email
    });

    for (let error of errors) req.flash('error', error);

    res.redirect(301, '/gateway');
  };

  try {
    let email = req.body.email;
    let sql = "SELECT * FROM members WHERE email = '" + email + "'";

    $database.con.query(sql, function (err, result, fields) {
      if (err) throw err;

      if (result.length) {
        return res.status(400).json({ errors: ['Member already registered'] });
      } else {
        let hash = bcrypt.hashSync(req.body.password, 10);

        let newMember = {
          username : req.body.name,
          password : hash,
          email    : req.body.email
        };

        let sql = "INSERT INTO members (name, email, password) VALUES ('" + newMember.username + "', '" + newMember.email + "', '" + newMember.password + "')";
        $database.con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });

        res.redirect('/dashboard');  
      }
    });
  } catch(e) {
    let err = [];

    console.log(e);
    e.forEach((element) => {
      err.push(element.param + ' ' + element.msg);
    }, this);

    handler(err);
  }
};

c_auth.forgotPassword = (req, res) => {
  res.render('auth/forgot-password');
};

c_auth.deleteAccountView = (req, res) => {
  res.render('auth/delete-account');
};

c_auth.logout = (req, res) => {
  req.logout();
  res.redirect('/gateway');
};

module.exports = c_auth;