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
      // console.log('results in database: ', results)
      callback(null, results);
    }
  });
};

var selectTitles = function(callback) {
  console.log('selectTitles is being called!')
  connection.query('SELECT title FROM chapters GROUP by title', function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      console.log('results in database: ', results)
      callback(null, results);
    }
  });
};

// var selectTitles = function(callback) {
//   connection.query('SELECT * FROM ', function(err, results, fields) {
//     if(err) {
//       callback(err, null);
//     } else {
//       callback(null, results);
//     }
//   });
// };

// SELECT ID, Val, Kind FROM
// (
//    SELECT First_Value(ID) OVER (PARTITION BY Val ORDER BY Kind) First, ID, Val, Kind
//    FROM mytable
// )
// WHERE ID = First;

var putVotes = function(callback) {

};

var insert = function(body, callback) {
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
module.exports.selectTitles = selectTitles;
module.exports.putVotes = putVotes;
module.exports.insert = insert;
