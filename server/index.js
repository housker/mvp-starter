var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const url = require('url');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
var items = require('../database-mysql');
// var items = require('../database-mongo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.get('/items*', function (req, res) {

// const myURL = url.parse(req.url);
// console.log('myUrl: ', myURL)

// const myURL = new URL('https://example.org/abc/xyz?123');
// console.log(myURL.pathname);
// // Prints /abc/xyz

// myURL.pathname = '/abcdef';
// console.log(myURL.href);
// // Prints https://example.org/abcdef?123



  var title = decodeURI(req.url.slice(7));
  console.log('title: ', title)
  items.selectChapter(title, function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      // console.log('data in server gotten from selectChapter: ', data)
      res.json(data);
    }
  });
});

app.get('/cities', function (req, res) {
  items.selectTitles(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/items', function (req, res) {
  // console.log('req.body in server: ', req.body.title, req.body.content, req.body.votes)
  items.insert(req.body, function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
  // items.insert(req.body, function(err, data) {
  //   if(err) {
  //     res.sendStatus(500);
  //   } else {
  //     res.json(data);
  //   }
  // });
});

app.put('/votes', function (req, res) {
  console.log('req.body in server put: ', req.body)
  items.updateVotes(req.body, function(err, data) {
    if(err) {
      console.log('error: ', err)
      res.sendStatus(500);
    } else {
      console.log('data in server put votes: ', data)
      res.json(data);
    }
  });
  // items.insert(req.body, function(err, data) {
  //   if(err) {
  //     res.sendStatus(500);
  //   } else {
  //     res.json(data);
  //   }
  // });
});




app.listen(3000, function() {
  console.log('listening on port 3000!');
});

