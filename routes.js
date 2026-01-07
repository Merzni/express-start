const express = require('express')
const router = express.Router()
const pool = require('./db')

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

router.get('/users', async (req, res) =>{
    try{
        const result = await pool.query('SELECT * FROM users ORDER BY id')
        res.json(result.rows)
    } catch(error) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/users', async (req, res) =>{
    const name = req.body.name
    if(!name) return res.status(400).json({ message: `invalid data` })
    try {
        const result = await pool.query(
            'INSERT INTO users (name) VALUES ($1) RETURNING *',
            [name]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id)

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/users/:id', async (req, res) => {
    const id = Number(req.params.id)
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Name is required' })
    }

    try {
        const result = await pool.query(
            'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/users/:id', async (req, res) => {
    const id = Number(req.params.id)

    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})



module.exports = router