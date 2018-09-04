const sha1 = require('sha1')
const axios = require('axios')

const className = 'todo'

const request = axios.create({
  baseURL: 'https://d.apicloud.com/mcm/api'
})

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
  const getHeaders = () => {
    const now = Date.now()
    return {
      'X-APICloud-AppId': appId,
      'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${now}`)}.${now}`
    }
  }
  return {
    async getAllTodos () {
      return handleRequest(await new Promise(resolve => {
        MongoClient.connect(url, (err, db) => {
          if (err) throw err
          const dbo = db.db('todolist')
          dbo.collection('datas').find({}).toArray((err, result) => {
            if (err) { throw err }
            db.close()
            console.log(result)
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
          dbo.collection('datas').insertOne(todo, (err, res) => {
            if (err) { throw err }
            db.close()
            resolve({
              status: 200,
              data: todo
            })
          })
        })
      }))
      // const Model = mongoose.model('data', Schema)
      // let apple = new Model(todo)
      // // 存放数据
      // return handleRequest(await new Promise((resolve) => {
      //   apple.save((err, apple) => {
      //     if (err) return console.log(err)
      //     apple.eat()
      //     resolve({
      //       status: 200,
      //       data: apple
      //     })
      //   })
      // }))
    },
    async updateTodo (id, todo) {
      return handleRequest(await request.put(
        `/${className}/${id}`,
        todo, {
          headers: getHeaders()
        }
      ))
    },
    async deleteTodo (id) {
      return handleRequest(await request.delete(
        `/${className}/${id}`, {
          headers: getHeaders()
        }
      ))
    },
    async deleteCompleted (ids) {
      const requests = ids.map(id => {
        return {
          method: 'DELETE',
          path: `/mcm/api/${className}/${id}`
        }
      })
      return handleRequest(await request.post(
        '/batch', {
          requests
        }, {
          headers: getHeaders()
        }
      ))
    }
  }
}
