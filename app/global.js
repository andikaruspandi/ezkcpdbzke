let $global = {};

$global.express    = require('express');
$global.session    = require('express-session');
$global.validator  = require('express-validator');
$global.path       = require('path');
$global.app        = $global.express();
$global.server     = require('http').Server($global.app);
$global.ejs        = require('ejs');
$global.cookie	   = require('cookie-parser');
$global.fse        = require('fs-extra');
$global.flash      = require('connect-flash');
$global.passport   = require('passport');
$global.bodyParser = require('body-parser');
$global.bcrypt     = require('bcrypt');

$global.mongoose      = require('bluebird').promisifyAll(require('mongoose'));
$global.LocalStrategy = require('passport-local').Strategy;

module.exports = $global;

