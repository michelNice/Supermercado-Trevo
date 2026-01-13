const express = require('express')
const Product = require('../models/Product')

const router = express.Router()

router.post('/', async (req, res) => {
  const product = await Product.create(req.body)
  res.json(product)
})

router.get('/', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

module.exports = router
