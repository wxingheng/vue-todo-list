// const sha1 = require('sha1')
// const axios = require('axios')

// const className = 'todo'

// const request = axios.create({
//   baseURL: 'https://d.apicloud.com/mcm/api'
// })

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://176.122.181.47:27017/todolist'

const createError = (code, resp) => {
  const err = new Error(resp.message)
  err.code = code
  return err
}

const handleRequest = ({
  status,
  data,
  ...rest
}) => {
  if (status === 200) {
    return data
  } else {
    throw createError(status, rest)
  }
}

module.exports = (appId, appKey) => {
  // const getHeaders = () => {
  //   const now = Date.now()
  //   return {
  //     'X-APICloud-AppId': appId,
  //     'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${now}`)}.${now}`
  //   }
  // }
  return {
    async getAllTodos () {
      return handleRequest(await new Promise(resolve => {
        MongoClient.connect(url, (err, db) => {
          if (err) throw err
          const dbo = db.db('todolist')
          dbo.collection('datas').find({}).toArray((err, result) => {
            if (err) {
              throw err
            }
            db.close()
            resolve({
              status: 200,
              data: result
            })
          })
        })
      }))
      // return handleRequest(await request.get(`/${className}`, {
      //   headers: getHeaders()
      // }))
    },
    async addTodo (todo) {
      // return handleRequest(await request.post(
      //   `/${className}`,
      //   todo, {
      //     headers: getHeaders()
      //   }
      // ))
      return handleRequest(await new Promise(resolve => {
        MongoClient.connect(url, (err, db) => {
          if (err) throw err
          const dbo = db.db('todolist')
          dbo.collection('datas').insertOne({ ...todo,
            id: new Date().getTime().toString()
          }, (err, res) => {
            if (err) {
              throw err
            }
            db.close()
            resolve({
              status: 200,
              data: todo
            })
          })
        })
      }))
    },
    async updateTodo (id, todo) {
      // return handleRequest(await request.put(
      //   `/${className}/${id}`,
      //   todo, {
      //     headers: getHeaders()
      //   }
      // ))
      return handleRequest(await new Promise(resolve => {
        MongoClient.connect(url, (err, db) => {
          if (err) throw err
          const dbo = db.db('todolist')
          const whereStr = {
            'id': id
          }
          const updateStr = {
            $set: {
              completed: todo.completed
            }
          }
          dbo.collection('datas').update(whereStr, updateStr, (err, res) => {
            if (err) {
              throw err
            }
            db.close()
            resolve({
              status: 200,
              data: todo
            })
          })
        })
      }))
    },
    async deleteTodo (id) {
      // return handleRequest(await request.delete(
      //   `/${className}/${id}`, {
      //     headers: getHeaders()
      //   }
      // ))
      return handleRequest(await new Promise(resolve => {
        MongoClient.connect(url, (err, db) => {
          if (err) throw err
          const dbo = db.db('todolist')
          const whereStr = {
            'id': id
          }
          dbo.collection('datas').deleteOne(whereStr, (err, res) => {
            if (err) {
              throw err
            }
            db.close()
            resolve({
              status: 200
            })
          })
        })
      }))
    },
    async deleteCompleted (ids) {
      console.log('ids:-->', ids)
      // const requests = ids.map(id => {
      //   return {
      //     method: 'DELETE',
      //     path: `/mcm/api/${className}/${id}`
      //   }
      // })
      // return handleRequest(await request.post(
      //   '/batch', {
      //     requests
      //   }, {
      //     headers: getHeaders()
      //   }
      // ))
      return handleRequest(await new Promise(resolve => {
        MongoClient.connect(url, (err, db) => {
          if (err) throw err
          const dbo = db.db('todolist')
          ids.map(d => {
            return new Promise(resolve => {
              dbo.collection('datas').deleteOne({id: d}, (err, res) => {
                if (err) {
                  throw err
                }
                return resolve()
              })
            })
          })
          Promise.all(ids).then(d => {
            db.close()
            resolve({
              status: 200
            })
          })
        })
      }))
    }
  }
}
