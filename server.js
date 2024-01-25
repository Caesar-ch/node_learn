const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mysql = require('mysql');
const fs = require('fs');
var session = require('express-session')
// 路由
const home = require('./router/home');
const user = require('./router/user')

const app = express();
// 注册静态资源中间件
app.use('/public', express.static('public')) // 在这里使用理这个中间件之后，在html里就可以写src为./public/img/people.png
app.use(cors());
app.use(cookieParser('123456'))
app.use(session)

app.use('/home', home);
app.use('/user', user);

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ch123456',
    database: 'tset',
})


// 接收所有的请求的中间件
app.use((req, res, next) => {
    console.log('全部请求 中间件');
    next()
})
app.use(session({
    // sessionId 的名字。The name of the session ID cookie to set in the response
    name: 'userCookie',
    // 秘钥
    secret: 'pjl-system-demo',
    cookie: {
        maxAge: 1000 * 600, // 60秒过期
        // true - 只有 https 才能访问 cookie
        secure: false
    },
    // true - 初始就给到 cookie。例如没有登录，直接点击“获取用户列表”，也会给到 cookie
    saveUninitialized: true,
}))

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

// 当客户端访问 /getPeople 请求的时候走当前中间件
app.use('/getPeople', (req, res, next) => {
    console.log('单个请求 中间件 ');
    next()// 加next就是中间件不用在这里处理req逻辑
})


app.get('/getPeople', (req, res) => {
    console.log('xx', req.signedCookies.user);
    db.query('SELECT * FROM user',
        (err, results) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(results);
                // res.cookie("user", '62566', { maxAge: 60000000, httpOnly: false, signed: true });
                res.send(JSON.stringify(results));
            }
        }
    );
});

app.post('/addPeople', (req, res) => {
    db.query('INSERT INTO user(username, animal) VALUES("xiaoming", "doggs")',
        (err, results) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(results);
                res.send(JSON.stringify(results));
            }
        }
    );
});
app.post('/addImage', (req, res) => {
    fs.readFile('bg.jpg',
        (err, data) => {
            let sql = 'INSERT INTO img SET ?';
            let post = { img: data, name: 'bg' };

            db.query(sql, post, (error, results) => {
                if (error) throw error;
                console.log("Image file has been saved to DB.");
            });
        }
    );
});
app.get('/getImage', (req, res) => {

    // const query = `
    //     SELECT img.* 
    //     FROM img 
    //     JOIN user ON user.id = img.id 
    //     WHERE user.username = ?
    // `
    // console.log('res', req.query);// get请求是query里拿查询参数，而不是param携带参数
    // db.query(query,[req.query.username], (error, results) => {
    //     let image = results[0].img;
    //     res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    //     // 将二进制数据写入响应
    //     res.end(image, 'binary');
    // });
    db.query('SELECT * FROM img', (error, results) => {
        let image = results[2].img;
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        // 将二进制数据写入响应
        res.end(image, 'binary');
    });
});
app.get('/deleteData', (req, res) => {
    const deleteSql = "DELETE FROM user WHERE username = ?";

    db.query(deleteSql, ['xiaoming'], (error, results) => {
        res.send('ok')
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.log('req', req.url);
    res.status(500).send(err.message);
})

// 当上面都未命中时会走这个
app.use((req, res, next) => {
    // 为客户端响应404状态码以及提示信息
    res.status(404).send('当前访问的页面是不存在的');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});