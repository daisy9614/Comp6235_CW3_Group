const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'xu2804628',
    database: 'uni',
    port: 3306,
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.get('/test', function (req, res) {
//     connection.connect();
//     const sql = `SELECT * FROM uni_durham WHERE id = 1`;
//     connection.query(sql, function (error, results) {
//         if (error) throw error;
//         res.send(results)
//     });
// });
// // Start the server
// const port = process.env.PORT || 5000;

// app.listen(5000, () => {
//   console.log('Go to http://localhost:3000/test to see posts');
// });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/get', function (req, res) {
  // connection.connect();
  const {uni, rent, safety, disUni, disRetail, minPrice, maxPrice, minDisUni, maxDisUni, minDisRetail, maxDisRetail} = req.query;
  console.log(uni, rent, safety, disUni, disRetail, minPrice, maxPrice, minDisUni, maxDisUni, minDisRetail, maxDisRetail);

  const sql = `select * from ${uni} where postcode IN (select h.postcode from \
              (select distinct postcode, Price_Score, Crime_Score, Distance_to_School_Score, \
              Store_Num_Score from ${uni} WHERE avg_price BETWEEN ${minPrice} AND \
              ${maxPrice} AND Distance_to_School BETWEEN ${minDisUni} AND ${maxDisUni} \
              AND Store_Num BETWEEN ${minDisRetail} AND ${maxDisRetail} ORDER BY \
              Price_Score*${rent} + Distance_to_School_Score*${disUni} \
              + Store_Num_Score*${disRetail} + Crime_Score*${safety} DESC LIMIT 10) AS h)`

  connection.query(sql, function (error, results) {
      if (error) throw error;
      //results = JSON.stringify(results)
      //console.log(results)
      res.send(results)
  });
  // connection.end();
});
// Start the server

app.get('/api/getuni', function (req, res) {

  const { uni } = req.query;
  const sql = `select max(avg_price),min(avg_price),max(Distance_to_School), min(Distance_to_School), max(Store_Num), min(Store_Num) from ${uni};`;
  connection.query(sql, function (error, results) {
      if (error) throw error;
      //console.log(results)
      res.send(results)
  });

});

app.listen(4000, () => {
  console.log('listenning');
});