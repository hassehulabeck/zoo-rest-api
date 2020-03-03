const express = require('express')
const app = express()
const router = require('./routes.js')

// Kunna hantera postningar från Postman
app.use(express.urlencoded({
    extended: true
}))

app.use('/', router)


app.listen(8080, () => {
    console.log("Zoo API lyssnar nu på 8080.")
})