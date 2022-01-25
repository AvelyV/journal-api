// same as doing an import
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// open connection to the database
const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: flase
    }
    // user: 'postgres',
    // password: 'postgres',
    // host: 'localhost',
    // port: 5433,
    // database: 'journal'
})

// initialises express
const app = express()



// insert middleware
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send({ info: "Journal API app"})
})

app.get('/categories', (req, res) => {
    pool.query('SELECT * FROM public.categories', (error, results) => {
        res.send(error? {error: error.message} : results.rows)
    })
    
})

app.get('/entries', (rec, res) => {
    pool.query('SELECT * FROM public.entries', (error, results) => {
        res.send(error? {error: error.message} : results.rows)
    })
})

// get entry by id
app.get('/entries/:id', (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM public.entries WHERE id = $1', [id], (error, results) => {
        if (error) {
            res.status(422).send( {error: error.message} )
        } else if (results.rows.length == 0) {
            res.status(404).send({ error: 'Entry not found'})
        }
        else {
        res.send(results.rows[0])
        }
    })
})

app.post('/entries', (req, res) => {
    pool.query('INSERT INTO entries (content, category_id) VALUES ($1, $2) RETURNING *', [req.body.content, req.body.cat_id], (error, results) => {
        if (error) {
            res.status(422).send( {error: error.message} )
        } else {
        res.send(results.rows[0])
        }
    })
})

module.exports = app