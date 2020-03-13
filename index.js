const express = require('express')
const app = express()
const router = require('./routes.js')
const bodyParser = require('body-parser')
const mysql = require('mysql')


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'zooAdmin',
    password: 'br0MMABL0cks',
    database: 'zoo',
})

app.use(bodyParser.json())


// Kunna hantera postningar från Postman
app.use(express.urlencoded({
    extended: true
}))

// API-key.
app.use('/', (req, res, next) => {
    let path = req.url
    path = path.substring(1, path.indexOf("/", 1))

    // Starta kontakt med servern.
    connection.connect()

    let sql = "SELECT COUNT(id) AS antal FROM users WHERE apikey = " + connection.escape(path)

    connection.query(sql, (err, result, field) => {
        if (err) throw err
        if (result[0].antal == 1) {
            console.log(result)
            req.body.hasAccess = true
        }
    })

    connection.end()

    next()
})



app.use('/', router)


app.listen(8080, () => {
    console.log("Zoo API lyssnar nu på 8080.")
})