const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.static('./blog'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('short'));

function getConnection(){
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mysql_test'
  });
}

app.post("/create_user", (req, res) => {
  console.log("yikes");
  console.log("First Name: " + req.body.first_name);
  res.end();

  queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)";
  getConnection().query(queryString, [req.body.first_name, req.body.last_name], (err, results, fields) => {
    if (err) {
      console.log("error: " + err);

    }
  });
})

app.get("/", (req, res) => {
  console.log("Responding to root route");
  res.send("Hello from ROOOOOOT");
})
app.get("/user/:id", (req, res) => {
  console.log(req.params.id);

  // const connection = getConnection();

  //const queryString = "SELECT * FROM users WHERE id = " + req.params.id;
  const queryString = "SELECT * FROM users WHERE id = ?"

  getConnection().query(queryString, [req.params.id], (err, rows, fields) => {

    if(err){
      console.log("error: " + err);
      res.sendStatus(500);
      res.end();
    }

    console.log('yikes');
    res.json(rows);
  })

})

app.get("/users", (req, res) => {
  const queryString = "SELECT * FROM users";
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mysql_test'
  })

  connection.query(queryString, (err, rows, fields) => {
    if(err){
      console.log("error: " + err);
      res.end();
    }
    res.json(rows);
  })
})

app.listen(3002, () => {
  console.log('Server is up and listening on 3002');
});
