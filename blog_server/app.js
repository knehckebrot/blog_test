const express = require('express');
const app = express();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.static('blog'));
app.use(bodyParser.json());
// app.use(morgan('short'));

function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mysql_test'
  });
}

app.get("/loadPostData", (req, res) => {

    const postDataQueryString = "SELECT id, title FROM blog_posts;";

    const postData = getConnection().query(postDataQueryString, (err, results, fields) => {
      if(err){
        res.sendStatus(500);
        console.log("error(loadPostData): " + err);
        res.end;
      }
      res.send(JSON.stringify(results));
    })

})

app.get("/loadPostCount", (req, res) => {

  const postCountQueryString = "SELECT COUNT(id) FROM blog_posts; ";

  const postCount = getConnection().query(postCountQueryString, (err, results, fields) => {
    if(err){
      res.sendStatus(500);
      console.log("error(postCount): " + err);
      res.end();
    }
    console.log(results);

    res.send(JSON.stringify(results));
  })
})

app.post("/blogpost_create", (req, res) => {

  const releaseDate = new Date();
  const date = releaseDate.getDate();
  const month = releaseDate.getMonth();
  const year = releaseDate.getFullYear();
  const hours = releaseDate.getHours();
  const minutes = releaseDate.getMinutes();
  const title = req.body.title;
  const text = req.body.text;

  console.log();
  console.log("blogpost <<" + title + ">> created")
  console.log(date + "-" + month + "-" + year + "-" + hours + "-" + minutes);

  const queryString = "INSERT INTO blog_posts (title, text, release_date, release_month, release_year, release_hours, release_minutes)  VALUES (?, ?, ?, ?, ?, ?, ?);";


  getConnection().query(queryString, [req.body.title, req.body.text, date, month, year, hours, minutes], (err, results, fields) => {
    if (err) {
      console.log("Error: " + err);
      res.sendStatus(500);
      res.end();
    }

    res.end();
  })

});

app.get("/blogpost_read", (req, res) => {

});

app.get("/", (req, res) => {
  res.end();
});

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
