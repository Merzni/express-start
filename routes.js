const express = require('express')
const router = express.Router()

let users = []
let nextId = 1

router.get('/', (req, res) => {
    res.json({message: 'Hello World'})
})

router.get('/health', (req, res) => {
    res.json({status: 'ok'})
})

router.get('/date', (req, res) => {
    const now = new Date()
    res.json({date: now.toISOString()})
})

router.get('/greet', (req, res) => {
    const name = req.query.name || 'Guest'
    res.json({message: `Hello ${name}!`})
})

router.get('/greet/:name', (req, res) => {
    const name = req.params.name || 'Guest'
    res.json({message: `Hello ${name}!`})
})

router.get('/calc', (req, res) => {
    const a = Number(req.query.a)
    const b = Number(req.query.b)
    res.json({answer: a+b})
})

router.get('/reverse', (req, res) =>{
    const word = req.query.word || ''
    const reversed = word.split('').reverse().join('')
    res.json({reversed})
})

router.get('/date-local', (req, res) => {
    const now = new Date()
    const dataStr = now.toLocaleString('ru-RU', {hour12: false})
    res.json({date: dataStr})
})

router.post('/echo', (req, res) => {
    const item = req.body
    res.json(item)
})

router.post('/sum', (req, res) => {
    const a = req.body.a
    const b = req.body.b
    if(a === undefined || b === undefined) return res.status(400).json({ error: "a and b are required" })
    if(typeof(a) !== 'number' || typeof(b) !== 'number') return res.status(400).json({ error: "Not a number" })
    const result = a+b
    res.json({result: result})
})

router.get('/users', (req, res) =>{
    res.json(users)
})

router.post('/users', (req, res) =>{
    const name = req.body.name
    if(!name) return res.status(400).json({ message: `invalid data` })
    const user = {id: nextId++, name: name}
    users.push(user)
    res.status(201).json(user)
})

router.get('/users/:id', (req, res) =>{
    const id = Number(req.params.id)
    let user = users.find(user => user.id === id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
})

router.put('/users/:id', (req, res) =>{
    const id = Number(req.params.id)
    const name = req.body.name
    let user = users.find(user => user.id === id)
    if(!user) return res.status(400).json({ message: `Not found`})
    if (!name) {
        return res.status(400).json({ error: 'Name is required' })
    }
    user.name = name
    res.json(user)
})

router.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = users.findIndex(user => user.id === id)

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' })
    }

    users.splice(index, 1)
    res.json({ message: 'User deleted' })
})


module.exports = router