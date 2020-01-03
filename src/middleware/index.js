const jwt = require("jsonwebtoken")
const jwtSecret = require("../../config/").jwtSecret

module.exports = function isLoggedIn(req, res, next) {

    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).send({
            error: "Please provide valid accessToken."
        })
    }

    const payload = jwt.verify(token, jwtSecret) 
   
    if (payload.id === req.params.id) {
      console.log("User is authenticated")
      next();
    } else {
      res.status(401).json({
          message: "Please provide valid authentication token."
      });
    }
  };