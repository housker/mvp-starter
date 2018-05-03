var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});

var selectAll = function(callback) {
  connection.query('SELECT * FROM chapters WHERE updated=(SELECT MAX(updated) FROM chapters)', function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      console.log('results in database: ', results)
      callback(null, results);
    }
  });
};

var insert = function(body, callback) {
  console.log('body in database: ', body)
  console.log('callback in database: ', callback)
  var values = [body.title, body.content, body.votes]
  connection.query('INSERT INTO chapters (title, content, votes) VALUES(?, ?, ?)', values, function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  })
}

module.exports.selectAll = selectAll;
module.exports.insert = insert;
