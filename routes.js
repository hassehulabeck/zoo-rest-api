const express = require('express')
const app = express()
const router = express.Router()
const mysql = require('mysql')


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'zooAdmin',
    password: 'br0MMABL0cks',
    database: 'zoo',
    multipleStatements: true
})

const setupQuery = "CREATE DATABASE IF NOT EXISTS zoo COLLATE = utf8mb4_swedish_ci; CREATE TABLE IF NOT EXISTS animals (id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, animalName varchar(20) DEFAULT NULL, age smallint(6) DEFAULT NULL, color varchar(14) DEFAULT NULL);INSERT INTO `animals` (`id`, `animalName`, `age`, `color`) VALUES(1, 'Gorilla', 4, 'Brun'), (3, 'Bisam', 4, 'Silvergrå'), (4, 'Råtta', 7, 'Grå'),(5, 'Grå Jako', 27, 'Blueish'),(6, 'Abborre', 3, 'Grön') ON DUPLICATE KEY UPDATE id = (id + 0)";


// Starta kontakt med servern.
connection.connect()

router.get('/', (req, res) => {
    res.send("Zoo API")
})

router.get('/setup', (req, res) => {
    connection.query(setupQuery, (err, result) => {
        if (err) throw err

        if (result.length == 3)
            res.send("Databas och tabell är skapade/uppdaterade.")
    })
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
    .delete((req, res) => {
        let sql = "DELETE FROM animals WHERE id =" + connection.escape(req.params.animalID)
        connection.query(sql, (err, result, fields) => {
            if (err) throw err
            res.json(result)
        })
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