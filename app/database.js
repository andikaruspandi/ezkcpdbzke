let $database  = {};

let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "widya"
});

$database.con = con;

$database.con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = $database;