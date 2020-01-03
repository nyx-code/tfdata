require("dotenv/config");

const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = express();
const register = require("./controllers/register");
const signin = require("./controllers/signin");
app.use(express.json());
app.use(cors());
const database = knex({
  client: process.env.DATABASE_CLIENT,
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  }
});

app.get("/", (req, res) => {
  res.send("It is working");
});
app.post("/signin", (req, res) =>
  signin.handleSignin(req, res, database, bcrypt, jwt)
);

app.post("/register", (req, res) =>
  register.handleRegister(req, res, database, bcrypt)
);

app.post("/products", (req, res) => {
  const { gender, relation, occasion, interest } = req.body;
  const val = interest.map((data, i) => {
    return data.toLowerCase();
  });
  // const cat = category.map((data, i) => {
  //   return data.toLowerCase();
  // });

  database
    .select("prodName", "price", "prodShortDesc", "imgLink")
    .from("gifts")
    .whereIn(
      "id",
      database
        .select("gift_id")
        .from("mapping")
        .whereIn(
          "interest_id",
          database
            .select("id")
            .from("interest")
            .whereIn(knex.raw("lower(interest)"), val)
        )
    )
    .where(knex.raw(" ',' || RTRIM(gender) || ',' "), "like", `%,${gender},%`)
    .where(
      knex.raw(" ',' || RTRIM(relation) || ',' "),
      "like",
      `%,${relation},%`
    )
    .where(
      knex.raw(" ',' || RTRIM(occasion) || ',' "),
      "like",
      `%,${occasion},%`
    )
    .then(resp => res.send(resp));
  // database
  //   .select("prodName", "price", "prodShortDesc", "imgLink")
  //   .from("gifts")
  //   .whereIn(
  //     "id",
  //     database
  //       .select("gift_id")
  //       .from("mapping")
  //       .whereIn(
  //         "category_id",
  //         database
  //           .select("id")
  //           .from("category")
  //           .whereIn(knex.raw("lower(prod_category)"), cat)
  //       )
  //       .orWhereIn(
  //         "subinterest_id",
  //         database
  //           .select("id")
  //           .from("subint")
  //           .whereIn(knex.raw("lower(subinterest)"), val)
  //       )
  //   )
  //   .then(resp => res.send(resp));
});
app.post("/productsbyint", (req, res) => {
  const { gender, relation, occasion, interest, subinterest } = req.body;
  const val = interest.map((data, i) => {
    return data.toLowerCase();
  });
  const subval = subinterest.map((data, i) => {
    return data.toLowerCase();
  });

  database
    .select("prodName", "price", "prodShortDesc", "imgLink")
    .from("gifts")
    .whereIn(
      "id",
      database
        .select("gift_id")
        .from("mapping")
        .whereIn(
          "interest_id",
          database
            .select("id")
            .from("interest")
            .whereIn(knex.raw("lower(interest)"), val)
        )
        .whereIn(
          "subinterest_id",
          database
            .select("id")
            .from("subint")
            .whereIn(knex.raw("lower(subinterest)"), subval)
        )
    )
    .where(knex.raw(" ',' || RTRIM(gender) || ',' "), "like", `%,${gender},%`)
    .where(
      knex.raw(" ',' || RTRIM(relation) || ',' "),
      "like",
      `%,${relation},%`
    )
    .where(
      knex.raw(" ',' || RTRIM(occasion) || ',' "),
      "like",
      `%,${occasion},%`
    )
    .then(resp => res.send(resp));
});

app.post("/productDetails", (req, res) => {
  const { prodName } = req.body;

  database
    .select("*")
    .from("gifts")
    .where("prodName", prodName)
    .then(resp => res.send(resp));
});

app.get("/interests", (req, res) => {
  database
    .select("*")
    .from("interest")
    .then(resp => res.send(resp));
});

app.get("/subinterest", (req, res) => {
  database
    .select("*")
    .from("subint")
    .then(resp => res.send(resp));
});
app.post("/subinterest", (req, res) => {
  const { interest } = req.body;
  const subval = interest.map((data, i) => {
    return data.toLowerCase();
  });

  database
    .select("*")
    .from("subint")
    .whereIn(
      "interest_id",
      database
        .select("id")
        .from("interest")
        .whereIn(knex.raw("lower(interest)"), subval)
    )
    .then(resp => res.send(resp));
});

app.post("/mapping", (req, res) => {
  const { gift, interest, subinterest, category } = req.body;
  database
    .insert({
      gift_id: database
        .select("id")
        .from("gifts")
        .where("prodName", "=", gift),
      interest_id: database
        .select("id")
        .from("interest")
        .where(knex.raw("lower(interest)"), "=", interest.toLowerCase()),
      subinterest_id: database
        .select("id")
        .from("subint")
        .where(knex.raw("lower(subinterest)"), "=", subinterest.toLowerCase()),
      category_id: database
        .select("id")
        .from("category")
        .where(knex.raw("lower(prod_category)"), "=", category.toLowerCase())
    })
    .into("mapping")
    .then(resp =>
      res.json(
        `${gift} successfully mapped to ${interest} interest and ${subinterest} subinterest`
      )
    )
    .catch(err => {
      console.log(err);
      res.status(400).json("Unable to map product");
    });
});
app.listen(3001);
