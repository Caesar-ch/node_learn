const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');

const app = express();

app.use(cors());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ch123456',
    database: 'tset',
})
app.get('/getPeople', (req, res) => {
    db.query('SELECT * FROM username',
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

app.post('/addPeople', (req, res) => {
    db.query('INSERT INTO username(username, animal) VALUES("xiaoming", "doggs")',
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
    fs.readFile('fengjing.png',
        (err, data) => {
            let sql = 'INSERT INTO img SET ?';
            console.log(data.name);
            let post = { img: data, name: 'fengjing' };

            db.query(sql, post, (error, results) => {
                if (error) throw error;
                console.log("Image file has been saved to DB.");
            });
        }
    );
});
app.get('/getImage', (req, res) => {
    db.query('SELECT * FROM img',(error, results) => {
        let image = results[0].img;
        res.writeHead(200, {'Content-Type': 'image/jpeg' });
        // 将二进制数据写入响应
        res.end(image, 'binary');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});