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
app.use('/', async (req, res, next) => {
    let path = req.url
    path = path.substring(1, path.indexOf("/", 1))

    // Starta kontakt med servern.
    connection.connect()

    let sql = "SELECT COUNT(id) AS antal, role FROM users WHERE apikey = " + connection.escape(path)

    await new Promise((resolve, reject) => {

        connection.query(sql, (err, result, field) => {
            if (err) throw err
            if (result[0].antal == 1) {
                req.body.hasAccess = true
                req.body.accessRole = result[0].role
                console.log(req.body)
                resolve(req.body)
                /* 
                hasAccess är om api-key i URIen är betrodd, och accessRole är vilka rättigheter api-key ger. 
                */
            }
        })
        connection.end()
    })
    next()
})
app.use('/', router)

app.listen(8080, () => {
    console.log("Zoo API lyssnar nu på 8080.")
})