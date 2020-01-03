const handleSignin = (req, res, database, bcrypt, jwt) => {
  const { email, password } = req.body;
  database
    .select("email", "hash")
    .from("credential")
    .where({ email })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return database
          .select("*")
          .from("users")
          .where({ email })
          .then(user => {
            jwt.sign({ user: user[0] }, "tfbeta", function(err, token) {
              res.json({ token });
              console.log(token);
            });
          });
      } else {
        res.json("Wrong credentials");
      }
    })
    .catch(err => {
      res.status(400).json("User not present");
      console.log(err);
    });
};

module.exports = { handleSignin };
