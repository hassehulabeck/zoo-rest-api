const express = require('express')
const app = express()
const router = require('./routes.js')
const bodyParser = require('body-parser')

app.use(bodyParser.json())


// Kunna hantera postningar från Postman
app.use(express.urlencoded({
    extended: true
}))

// API-key.
app.use('/', (req, res, next) => {
    let path = req.url
    let apiKey = "XYZ"
    if (path.includes(apiKey)) {
        req.body.hasAccess = true
    }
    console.log(req.body)
    next()
})



app.use('/', router)


app.listen(8080, () => {
    console.log("Zoo API lyssnar nu på 8080.")
})