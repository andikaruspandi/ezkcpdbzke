let app      = require('./global').app;
let passport = require('./global').passport;
let fn       = require('./helper/functions.js');

//controllers
let auth    = require('./controller/auth.js');
let product = require('./controller/product.js');
let cpass   = require('./controller/passport.js');
let { body } = require('express-validator');

let $routes = {};

$routes.init = () => {
  //products
  app.get('/dashboard', fn.loggedIn, product.dashboard);
  app.get('/products', fn.loggedIn, product.getData);
  app.get('/products/total', fn.loggedIn, product.getTotalDataByPrice);
  app.get('/products/:id', fn.loggedIn, product.getDataById);
  app.post('/products', fn.loggedIn, product.insert);
  app.post('/products/:id', fn.loggedIn, product.update);
  app.post('/products/delete/:id', fn.loggedIn, product.delete);

  //auth
  app.get('/gateway', fn.checkLogged, auth.gateway);
  app.post('/login', fn.checkLogged, auth.login);
  app.post('/register', 
    fn.checkLogged,
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    auth.register);
  app.get('/delete-account', fn.checkLogged, auth.deleteAccountView);
  app.post('/delete-account', fn.checkLogged, auth.deleteAccount);
  app.get('/logout', fn.loggedIn, auth.logout);

  //passport
  passport.serializeUser(cpass.serialize);
  passport.deserializeUser(cpass.deserialize);
  passport.use('local', cpass.LocalStrategy);
};

module.exports = $routes;