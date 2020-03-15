const express = require('express')
const app = express()
const router = require('./routes.js')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

/* Mysql2 har inbyggt stöd för promises och async/await, vilket mysql saknar (märkligt nog) */

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

    let sql = "SELECT COUNT(id) AS antal, role FROM users WHERE apikey = ?"

    /* Gör själva query-funktionen async för att kunna vänta in resultatet från db.*/
    let resultat = await connection.promise().query(sql, [path], (err, result, fields) => {
        if (err)
            throw err
    })

    /* Behövde laborera ett tag för att hitta rätt i resultatet */
    console.log(resultat[0][0].antal)

    /* Om vi får rätt svar från db:n, så sätter vi några egenskaper i req.body så att resten av applikationen kan se om URI-anropet har en betrodd API-key */
    if (resultat[0][0].antal == 1) {
        console.log("Hurra")
        req.body.hasAccess = true
        req.body.accessRole = resultat[0][0].role
        /*
        hasAccess är om api-key i URIen är betrodd, och accessRole är vilka rättigheter api-key ger, dvs authentication resp authorization.
        */
    }

    /* Kör man utan async/await, så hinner next köra innan db-queryn är klar. */
    next()
})

app.use('/', router)

app.listen(8080, () => {
    console.log("Zoo API lyssnar nu på 8080.")
})