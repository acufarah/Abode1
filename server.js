const express = require('express');
const app = express();
const sqlite= require('sqlite3');
const db= new sqlite.Database('./database.sqlite3', (err)=> console.log(err));

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})