const mongoose = require('mongoose')

const ProductShema = new mongoose.Schema({
    name:String,
    price:Number,
    description:String,
    image:String
})

module.exports = mongoose.model('Product',ProductShema)