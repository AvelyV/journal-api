const app = require('./app')

// different from front-end
const port = process.env.PORT || 4000


// callback will be called when it is waiting for connection to come back
app.listen(port, () => {
    console.log(`Journal API listening at http://localhost:${port}`)
})

