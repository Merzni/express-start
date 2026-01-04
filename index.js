const express = require('express')
const routes = require('./routes')
const app = express()
const PORT = 3000

app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use(routes)

app.listen(PORT, () =>{
    console.log(`Server working on ${PORT} port`)
})