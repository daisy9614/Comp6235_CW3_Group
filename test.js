const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'xxx',
    database: 'uni',
    port: 3306,
});

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

const sql = `SELECT * FROM uni_durham WHERE id = 1`;
con.query(sql, (err, result) => {
    if (err) throw err;
    body = {
        code: 200,
        data: result
    }
    console.log(result[0]);
})
