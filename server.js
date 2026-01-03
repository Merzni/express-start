const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.json({message: 'Hello World'})
})

app.get('/health', (req, res) => {
    res.json({status: 'ok'})
})

app.get('/date', (req, res) => {
    const now = new Date()
    res.json({date: now.toISOString()})
})

app.get('/greet', (req, res) => {
    const name = req.query.name || 'Guest'
    res.json({message: `Hello ${name}!`})
})

app.listen(PORT, () =>{
    console.log(`Server working on ${PORT} port`)
})