const express = require('express')
const app = express()
const router = express.Router()
const mysql = require('mysql')

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'zooAdmin',
    password: 'br0MMABL0cks',
    database: 'zoo'
})

router.get('/', (req, res) => {
    res.send("Zoo API")
})

router.get('/animals', (req, res) => {
    connection.connect()
    connection.query('SELECT * FROM animals', (err, result, fields) => {
        if (err) throw error
        res.json(result)
    })
    connection.end()
})

router.get('/animals/:animalID', (req, res) => {
    connection.connect()
    let sql = "SELECT * FROM animals WHERE id =" + connection.escape(req.params.animalID)
    connection.query(sql, (err, result, fields) => {
        if (err) throw err
        res.json(result)
    })
    connection.end()
})

module.exports = router