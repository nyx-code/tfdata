const express = require("express")

const Product = require("../../models/Product")
const ProductMap = require("../../models/ProductMap")
const isLoggedIn = require("../../middleware/")

const router = express.Router()

router.get('/all/:id',isLoggedIn,(req, res) => {
    Product.find()
        .then(snapshot => {
            if (snapshot) {
                res.status(200).json(snapshot)
            }
            else {
                res.status(404).json({
                    message: "Data could not be found."
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            })
        })
})

router.get('/suggest/:id',isLoggedIn,(req, res) => {
    ProductMap.find({ $or: [ {genderType: req.body.genderType}, {relation: req.body.relation}, {occasion: req.body.occasion}, {tags: {$in: [...req.body.tags]}} ]})
        .populate('product')
        .then(snapshot => {
            if (snapshot) {
                res.status(200).json(snapshot)
            }
            else {
                res.status(200).json({
                    message: "Nothing to suggest."
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            })
        })
})

router.post('/add', (req, res) => {
   const product = new Product({
       ...req.body
   })

   product.save()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            })
        })
})

router.post('/productmap/add/:productId', (req, res) => {
    Product.findById(req.params.productId)
        .then(data => {
            if (data) {
                const productMap = new ProductMap({
                    product: req.params.productId,
                    ...req.body
                })

                productMap.save()
                    .then(data => {
                        Product.findByIdAndUpdate(req.params.productId,{productMap: data._id})
                            .then(() => {
                                res.status(200).json(data)
                            })
                            .catch(error => {
                                res.status(500).json({
                                    message: error.message
                                })
                            })
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: error.message
                        })
                    })
            } else {
                res.status(404).json({
                    message: "Product could not be found."
                })
            }
        })
    
})

module.exports = router