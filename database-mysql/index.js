var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DB_NAME
});

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'gitsaga'
// });

var check = function() {
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected to database");
  });
};

var selectChapter = function(title, callback) {
  connection.query(`SELECT * FROM chapters WHERE title = '${title}' ORDER BY updated DESC LIMIT 1`, function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

var selectCities = function(callback) {
  connection.query('SELECT title, geolocation FROM chapters GROUP BY title', function(err, results, fields) {
    if(err) {
      console.log('error: ', err)
      callback(err, null);
    } else {
      console.log('results in db: ', results)
      callback(null, results);
    }
  });
};

var updateVotes = function(body, callback) {
  if(body.votes > 10) {
    connection.query(`DELETE from chapters WHERE title = '${body.title}'`, function(err, results, fields) {
      if(err) {
        callback(err, null);
      } else {
        var values = [body.title, body.content, body.votes, body.geolocation]
        connection.query('INSERT INTO chapters (title, content, votes, geolocation) VALUES(?, ?, ?, ?)', values, function(err, results, fields) {
          if(err) {
            callback(err, null);
          } else {
            callback(null, results);
          }
        })
      }
    })
  } else if(body.votes < -5) {
    connection.query(`DELETE from chapters WHERE title = '${body.title}' and id IN (SELECT id FROM (SELECT id FROM chapters WHERE title = '${body.title}' ORDER BY updated DESC LIMIT 1) AS temp)`, function(err, results, fields) {
      if(err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    })
  } else {
    connection.query(`UPDATE chapters SET votes = ${body.votes} WHERE id IN (SELECT id FROM (SELECT id FROM chapters WHERE title = '${body.title}' ORDER BY updated DESC LIMIT 1) AS temp)`, function(err, results, fields) {
      if(err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    })
  }
};

var insert = function(body, callback) {
  var values = [body.title, body.content, body.geolocation, body.votes]
  connection.query('INSERT INTO chapters (title, content, geolocation, votes) VALUES(?, ?, ?, ?)', values, function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  })
}

module.exports.selectChapter = selectChapter;
module.exports.selectCities = selectCities;
module.exports.updateVotes = updateVotes;
module.exports.insert = insert;
module.exports.check = check;
