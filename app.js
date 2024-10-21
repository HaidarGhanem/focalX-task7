require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = reuqire('express-session')
const ConnectDB = require('./configs/db')

const app = express()
const PORT = 3000

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(cors())
app.use(bodyParser.json())

const URL = process.env.URL
ConnectDB(URL)

app.use('/api/admins' , require('./routes/admins'))
app.use('/api/users' , require('./routes/users'))

app.listen(PORT,()=>{
    console.log(`server is running on port : ${PORT}`)
})