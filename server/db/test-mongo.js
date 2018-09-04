var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://176.122.181.47:27017/todolist'
MongoClient.connect(url, function (err, db) {
  if (err) {
    throw err
  };
  console.log('数据库已创建')
  var dbase = db.db('todolist');
  dbase.createCollection('site', function (err, res) {
    if (err) {
      throw err
    };
    console.log('创建集合!')
    db.close()
  });
});
