const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const users = require('./routes/users')
app.use('/', users)

app.listen(PORT, () =>  {
    console.log(`Server running`);
})