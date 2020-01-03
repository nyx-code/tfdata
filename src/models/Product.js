const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    productMap: {
        type: Schema.Types.ObjectId,
        ref: 'product_map'
    },
    link: {
        type: String,
        required: true
    }

}) 

const Product = mongoose.model("products", ProductSchema)

module.exports = Product