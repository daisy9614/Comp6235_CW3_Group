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
  const {rent, safety, disUni, disRetail} = req.query;
  console.log(rent, safety, disUni, disRetail);
  const sql = `SELECT * from uni_durham ORDER BY Price_Score*${rent} + Distance_to_School_Score*${disUni} + Store_Num_Score*${disRetail} + Crime_Score*${safety} DESC LIMIT 1`;
  //const sql = `SELECT Price_Score*0.2 + Distance_to_School_Score*0.2 + Store_Num_Score*0.2 + Crime_Score*0.2 as total_score FROM uni_durham ORDER BY total_score DESC`;
  //const sql = `SELECT * FROM uni_durham WHERE id = 1`;
  connection.query(sql, function (error, results) {
      if (error) throw error;
      //results = JSON.stringify(results)
      console.log(results)
      res.send(results)
  });
  // connection.end();
});
// Start the server

app.get('/api/post', function (req, res) {
  connection.connect();
  const { school } = req.query;
  const sql = `SELECT * FROM ${school} WHERE id = 1`;
  connection.query(sql, function (error, results) {
      if (error) throw error;
      res.send(results)
  });
  connection.end();
});

app.listen(4000, () => {
  console.log('listenning');
});