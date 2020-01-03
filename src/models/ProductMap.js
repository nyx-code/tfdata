const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ProductMapSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    genderType: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    occasion: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    }
})

const ProductMap = mongoose.model('product_map', ProductMapSchema)

module.exports = ProductMap