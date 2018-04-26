/* Database Connection */
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connection Established');
});

connection.query('CREATE DATABASE IF NOT EXISTS TheLecturersPlan');
connection.query('USE TheLecturersPlan');

module.exports = connection;
