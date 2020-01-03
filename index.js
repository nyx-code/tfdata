const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const mongoURL = require("./config").mongoURL
const app = express()
const port = process.env.PORT || 3000

const login = require("./src/routes/auth/login")
const createUser = require("./src/routes/auth/createUser")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(mongoURL, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true })
    .then(()=> console.log("Database Connected!"))
    .catch((error) => console.log(`ERROR: ${error.message}`))

app.get('/', (req,res) => {
    const body = {
        message: "You are on Homepage. Documentation will be here soon!"
    }
    res.send(body)
})

app.use('/login', login)
app.use('/createuser', createUser)

app.listen(port, () => {
    console.log(`Server is up at port: ${port}`)
})