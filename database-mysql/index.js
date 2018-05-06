var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});

var selectChapter = function(title, callback) {
  // console.log('title in databse selectChapter: ', title)
  connection.query(`SELECT * FROM chapters WHERE title = '${title}' ORDER BY updated LIMIT 1`, function(err, results, fields) {
    if(err) {
      console.log('Error in database trying to find select')
      callback(err, null);
    } else {
      // console.log('results in database selectChapter: ', results)
      callback(null, results);
    }
  });


// UPDATE chapters SET votes = ${body.votes} WHERE id = (SELECT id FROM chapters WHERE title = '${body.title}' ORDER BY updated LIMIT 1)
// `SELECT * FROM chapters WHERE title = ${title} ORDER BY updated LIMIT 1`
// (`SELECT * FROM chapters WHERE title = ${title} AND updated = (SELECT MAX(updated) FROM chapters)`
  // connection.query(`SELECT * FROM chapters WHERE (updated=(SELECT MAX(updated) AND title = ${title}) FROM chapters)`, function(err, results, fields) {
  //   if(err) {
  //     console.log('Error in database trying to find select')
  //     callback(err, null);
  //   } else {
  //     // console.log('results in database: ', results)
  //     callback(null, results);
  //   }
  // });

  // results in database selectChapter:  [ RowDataPacket {
  //   id: 1,
  //   title: 'Houston, TX',
  //   content: '<p>There was a story.</p>',
  //   votes: 3,
  //   updated: 2018-05-02T20:30:28.000Z } ]

};

var selectTitles = function(callback) {
  connection.query('SELECT title FROM chapters GROUP by title', function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      // console.log('results in database: ', results)
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

var updateVotes = function(body, callback) {
  if(body.votes > 10) {
    console.log("Database updateVotes - There are more than ten votes.")
    connection.query(`DELETE from chapters WHERE title = '${body.title}'`, function(err, results, fields) {
      if(err) {
        callback(err, null);
      } else {
        console.log('These are the results in updateVotes: ', results)
        var values = [body.title, body.content, body.votes]
        console.log('values in updateVotes: ', values)
        connection.query('INSERT INTO chapters (title, content, votes) VALUES(?, ?, ?)', values, function(err, results, fields) {
          if(err) {
            callback(err, null);
          } else {
            callback(null, results);
          }
        })
      }
    })
    // var values = [body.title, body.content, body.votes]
    // connection.query('INSERT INTO chapters (title, content, votes) VALUES(?, ?, ?)', values, function(err, results, fields) {
    //   if(err) {
    //     callback(err, null);
    //   } else {
    //     callback(null, results);
    //   }
    // })
  } else if(body.votes < -5) {
    console.log("Database updateVotes - There are less than neg five votes.")
    connection.query(`DELETE from chapters WHERE title = ${body.title}`, function(err, results, fields) {
      if(err) {
        callback(err, null);
      } else {
        console.log('These are the results in updateVotes: ', results)
        callback(null, results);
      }
    })
  } else {
    console.log("Database updateVotes - There are between neg five votes and ten votes.")
    connection.query(`UPDATE chapters SET votes = ${body.votes} WHERE id IN (SELECT id FROM (SELECT id FROM chapters WHERE title = '${body.title}' ORDER BY updated LIMIT 1) AS temp)`, function(err, results, fields) {
    // connection.query(`SELECT id FROM chapters WHERE title = '${body.title}' ORDER BY updated LIMIT 1`, function(err, results, fields) {
      if(err) {
        callback(err, null);
      } else {
        console.log('These are the results in updateVotes: ', results)
        callback(null, results);
      }
    })
  }


};

// title = ${body.title}` AND updated = (SELECT MAX(updated) FROM chapters)

var insert = function(body, callback) {
  console.log('this is body.content in database insert: ', body.content)
  var values = [body.title, body.content, body.votes]
  connection.query('INSERT INTO chapters (title, content, votes) VALUES(?, ?, ?)', values, function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  })
}

module.exports.selectChapter = selectChapter;
module.exports.selectTitles = selectTitles;
module.exports.updateVotes = updateVotes;
module.exports.insert = insert;
