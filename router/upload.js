const express = require('express')
const upload = express.Router()

upload.post('/upload', (res, req) => {
    // 拿到用户 id 和 资源

    // 存到image表
    //   找个图床，进行资源的链接生成，然后在表里存链接和用户id

    // 根据参数的配置项，进行utils图片操作函数的处理，然后存起来
})