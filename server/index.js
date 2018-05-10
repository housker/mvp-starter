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
  var title = decodeURI(req.url.slice(7));
  items.selectChapter(title, function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.get('/cities', function (req, res) {
  items.selectCities(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/items', function (req, res) {
  items.insert(req.body, function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.put('/votes', function (req, res) {
  items.updateVotes(req.body, function(err, data) {
    if(err) {
      console.log('error: ', err)
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

let port = process.env.PORT || 3000

app.listen(port, function() {
  console.log(`listening on port ${port}!`);
  items.check();
});

