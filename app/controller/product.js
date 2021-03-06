let $database = require('../database');
let { validationResult } = require('../global').validator;
let c_product = {};

c_product.dashboard = (req, res) => {
  res.render('dashboard/index');
};

c_product.getData = (req, res) => {
  let sql = "SELECT id, name, price FROM products";

  $database.con.query(sql, function (err, results, fields) {
    if (err) throw err;

    if (!results.length) {
      return res.status(400).json({ errors: ['Data not available'] });
    } else {
      return res.status(200).json(results);
    }
  });
};

c_product.getDataById = (req, res) => {
  let sql = "SELECT id, name, price FROM products WHERE id = ?";

  $database.con.query(sql, [req.params.id], function (err, results, fields) {
    if (err) throw err;

    if (!results.length) {
      return res.status(400).json({ errors: ['Data not available'] });
    } else {
      return res.status(200).json(results[0]);
    }
  });
};

c_product.getTotalDataByPrice = (req, res) => {
  let sql = "SELECT COUNT(*) as total_products FROM products WHERE price > 80000";

  $database.con.query(sql, function (err, results, fields) {
    if (err) throw err;

    if (!results.length) {
      return res.status(400).json({ errors: ['Data not available'] });
    } else {
      return res.status(200).json(results[0]);
    }
  });
};

c_product.insert = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let post  = {
    name: req.body.name, 
    price: req.body.price
  };

  let sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  $database.con.query(sql, [post.name, post.price], function (error, results, fields) {
    if (error) throw error;
    let sql2 = "SELECT id, name, price FROM products WHERE id = ?";
    
    $database.con.query(sql2, [results.insertId], function (err, resu, f) {
      if (error) throw error;

      return res.status(200).json(resu);
    })
  });
};

c_product.update = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  let post  = {
    id: req.params.id,
    name: req.body.name, 
    price: req.body.price
  };

  let sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
  $database.con.query(sql, [post.name, post.price, post.id], function (error, results, fields) {
    if (error) throw error;
  
    return res.status(200).json(results);
  });
};

c_product.delete = (req, res) => {
  let sql = 'DELETE FROM products WHERE id = ?';
  $database.con.query(sql, [req.params.id], function (error, results, fields) {
    if (error) throw error;
  
    return res.status(200).json(results);
  });
};

module.exports = c_product;