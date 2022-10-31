const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

require('dotenv').config();

app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: [ 'GET', 'POST', 'PATCH' ],
    optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use('/user', require('./routes/userRoutes'))

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    app.listen(4000, ()=>{
        console.log('Connected to db and listening on port 4000')
    })
}).catch((error)=>{
    console.log(error)
})