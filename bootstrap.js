//let $database   = require('./app/database');
let $middleware = require('./app/middleware');
let $routes     = require('./app/routes');
let server      = require('./app/global').server;

$middleware.init();

$routes.init();

let port = process.env.PORT || 8082;
server.listen(port);