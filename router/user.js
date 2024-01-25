const express = require('express')
const userRouter = express.Router()

// 用户的登录
userRouter.post('/login', (req, res) => {
    // 进行数据库查询校验

    // 加入sessionid返回到cookie里
})

// 用户注册
userRouter.post('/sign', (req, res) => {
    // 进行数据库账号名查询是否重复

    // 不重复存进去，并进行sessionId生成，返回cookie
})
module.exports = userRouter