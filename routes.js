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

/* REGEX-matchningar: 
/? = 0 eller fler /
[a-zA-Z0-9]{0,3} = Gemener, versaler och siffror i kombination, mellan 0 och 3 tecken.
/ = /
*/
router.get('/?[a-zA-Z0-9]{0,20}/', (req, res) => {
    if (req.body.hasAccess)
        res.send("Zoo API")
    else
        res.status(401).send("Nej")
})

router.get('/setup', (req, res) => {
    connection.query(setupQuery, (err, result) => {
        if (err) throw err

        if (result.length == 3)
            res.send("Databas och tabell är skapade/uppdaterade.")
    })
})

router.route('/?[a-zA-Z0-9]{0,20}/animals/:animalID')
    .get((req, res) => {
        let sql = "SELECT * FROM animals WHERE id =" + connection.escape(req.params.animalID)
        connection.query(sql, (err, result, fields) => {
            if (err) throw err
            res.json(result)
        })
    })
    .put((req, res) => {
        if (req.body.hasAccess)
            updatePost(req, res)
    })
    .patch((req, res) => {
        if (req.body.hasAccess)
            updatePost(req, res)
        else
            res.status(401).send("Tyvärr")
    })
    .delete((req, res) => {
        if (req.body.hasAccess) {
            let sql = "DELETE FROM animals WHERE id =" + connection.escape(req.params.animalID)
            connection.query(sql, (err, result, fields) => {
                if (err) throw err
                res.json(result)
            })
        }
    })

router.route('/?[a-zA-Z0-9]{0,20}/animals')
    .get((req, res) => {
        connection.query('SELECT * FROM animals', (err, result, fields) => {
            if (err) throw error
            res.json(result)
        })
    })
    .post((req, res) => {
        if (req.body.hasAccess) {
            let columns = []
            let values = []
            for (let column in req.body) {
                if (column != 'hasAccess') {
                    columns.push(column)
                    values.push(req.body[column])
                }
            }
            let sql = 'INSERT INTO animals (??) VALUES (?)'
            sql = mysql.format(sql, [columns, values])
            connection.query(sql, (err, result, fields) => {
                if (err) throw err
                res.json(result)
            })
        } else {
            res.status(401).send("Nope")
        }
    })

function updatePost(req, res) {

    // Frågetecknet i queryn gör att indata (req.body) escape:as, dvs tvättas från ev farlig kod.
    // Flytta req.body till data och ta bort hasAccess.
    let data = req.body
    delete data.hasAccess
    let sql = 'UPDATE animals SET ? WHERE id =' + connection.escape(req.params.animalID)
    connection.query(sql, data, (err, result, fields) => {
        if (err) throw err
        res.json(result)
    })
}

module.exports = router