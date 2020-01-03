const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require("../../models/User")

const jwtSecret = require("../../../config/").jwtSecret

const router = express.Router()

router.get('/', (req, res) => {
    User.findOne({email: req.body.email})
        .then((data) => {
            if (data) {
                if(bcrypt.compareSync(req.body.password, data.password)) {
                    const accessToken = jwt.sign({
                        id: data._id
                    }, jwtSecret)

                    const body = {
                        accessToken,
                        ...data._doc
                    }
                    res.status(200).json(body)
                } else {
                    res.status(401).json({
                        message: "Please provide valid Password."
                    });
                }
                
            } else {
                const message = "User doesn't exist with given email."
                res.status(404).send({
                    message
                })

            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
})

module.exports = router