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
  app.post('/products', 
    fn.loggedIn, 
    body('name').isLength({ min:3 }),
    body('price').isLength({ min:1 }),
    product.insert
  );
  app.post('/products/:id', 
    fn.loggedIn, 
    body('name').isLength({ min:3 }),
    body('price').isLength({ min:1 }),
    product.update
  );
  app.post('/products/delete/:id', fn.loggedIn, product.delete);

  //auth
  app.get('/gateway', fn.checkLogged, auth.gateway);
  app.post('/login', fn.checkLogged, auth.login);
  app.post('/register', 
    fn.checkLogged,
    body('name').isLength({ min:3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('password').custom((value, { req }) => {
      if (value !== req.body.repassword) {
        throw new Error('Password confirmation does not match password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
    auth.register
  );
  app.get('/logout', fn.loggedIn, auth.logout);

  //passport
  passport.serializeUser(cpass.serialize);
  passport.deserializeUser(cpass.deserialize);
  passport.use('local', cpass.LocalStrategy);
};

module.exports = $routes;