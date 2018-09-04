var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://176.122.181.47:27017/todolist'

MongoClient.connect(url, function (err, db) {
  if (err) throw err
  var dbo = db.db('todolist')
  var whereStr = {
    // '_id': ObjectId("5b8e49d3def9037811343927")
    'id': '1536065328656'
  }
  dbo.collection('datas').deleteOne(whereStr, (err, res) => {
    if (err) throw err
    db.close()
  })
})
