const Router = require('koa-router')

const userRouter = new Router({ prefix: '/user' })

userRouter.post('/login', async ctx => {
  const user = ctx.request.body
  if (user.username === 'wuxh' && user.password === '001') {
    ctx.session.user = {
      username: 'wuxh'
    }
    ctx.body = {
      success: true,
      data: {
        username: 'wuxh'
      }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: 'username or password error'
    }
  }
})

module.exports = userRouter
