const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require("../../models/User")

const jwtSecret = require("../../../config/").jwtSecret

const router = express.Router()

router.post('/', (req, res) => {
    User.findOne({email: req.body.email})
        .then((snapshot) => {
            if (snapshot) {
                const message = "User already exist with given email."
                res.status(400).send({
                    message
                })
            } else {

                let password = bcrypt.hashSync(req.body.password, 10);

                const user = new User({
                    name: req.body.name,
                    gender: req.body.gender,
                    email: req.body.email,
                    age: req.body.age,
                    relStatus: req.body.relStatus,
                    relAge: req.body.relAge,
                    password
                }) 

                user.save()
                    .then(data => {
                        const accessToken = jwt.sign({
                            id: data._id
                        }, jwtSecret)

                        const body = {
                            accessToken,
                            ...data._doc
                        }
                        res.status(200).json(body)
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message
                        })
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