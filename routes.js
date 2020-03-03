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

// Starta kontakt med servern.
connection.connect()

router.get('/', (req, res) => {
    res.send("Zoo API")
})

router.route('/animals')
    .get((req, res) => {
        connection.query('SELECT * FROM animals', (err, result, fields) => {
            if (err) throw error
            res.json(result)
        })
    })
    .post((req, res) => {
        let columns = []
        let values = []
        for (let column in req.body) {
            columns.push(column)
            values.push(req.body[column])
        }
        let sql = 'INSERT INTO animals (??) VALUES (?)'
        sql = mysql.format(sql, [columns, values])
        connection.query(sql, (err, result, fields) => {
            if (err) throw err
            res.json(result)
        })
    })

router.route('/animals/:animalID')
    .get((req, res) => {
        let sql = "SELECT * FROM animals WHERE id =" + connection.escape(req.params.animalID)
        connection.query(sql, (err, result, fields) => {
            if (err) throw err
            res.json(result)
        })
    })
    .put((req, res) => {
        updatePost(req, res)
    })
    .patch((req, res) => {
        updatePost(req, res)
    })


function updatePost(req, res) {

    // Frågetecknet i queryn gör att indata (req.body) escape:as, dvs tvättas från ev farlig kod.

    let sql = 'UPDATE animals SET ? WHERE id =' + connection.escape(req.params.animalID)
    connection.query(sql, req.body, (err, result, fields) => {
        if (err) throw err
        res.json(result)
    })
}

module.exports = router