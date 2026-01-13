const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// conexão com o banco
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err))

// rotas
const productRoutes = require('./routes/products')
app.use('/products', productRoutes)

// rota teste
app.get('/', (req, res) => {
  res.send('API do Trevo funcionando 🚀')
})

// servidor
app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333')
})
