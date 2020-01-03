const handleRegister = (req, res, database, bcrypt) => {
  const { name, email, password, relStatus, age, relAge, gender } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  database
    .transaction(trx => {
      trx
        .insert({
          hash: hash,
          email: email
        })
        .into("credential")
        .returning("email")
        .then(loginEmail => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: loginEmail[0],
              age: age,
              gender: gender,
              relAge: relAge,
              relStatus: relStatus
            })
            .then(user => res.json(user[0]));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => {
      res.status(400).json("Unable to register");
      console.log(err);
    });
};
module.exports = { handleRegister };
