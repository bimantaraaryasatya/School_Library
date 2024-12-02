// load library express
const express = require(`express`)
const app = express()
const PORT = 8000 // define port of server
const cors = require(`cors`) // load library cors
app.use(cors()) // open CORS policy

const memberRoute = require(`./routes/member.route`) 
app.use(`/member`, memberRoute) 

const bookRoute = require(`./routes/book.route`)
app.use(`/book`, bookRoute)

app.use(express.static(__dirname))

const borrowRoute = require(`./routes/borrow.route`)
app.use(`/borrow`, borrowRoute)

const adminRoute = require(`./routes/admin.route`)
app.use(`/admin`, adminRoute)

const auth = require(`./routes/auth.route`)
app.use(`/auth`, auth)

// run server based on defined port
app.listen(PORT, () => {
    console.log(`Server of School's Library runs on port ${PORT}`)
})