const express = require("express")

const User = require("../../models/User")
const isLoggedIn = require("../../middleware/")

const router = express.Router()

router.get('/:id',isLoggedIn,(req, res) => {
    User.findById(req.params.id)
        .then(data => {
            if (data) {
                res.status(200).json(data)
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

module.exports = router