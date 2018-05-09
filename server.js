"use strict";

require('dotenv').config();

const PORT         = process.env.PORT || 8080;
const ENV          = process.env.ENV || "development";
const express      = require("express");
const bodyParser   = require("body-parser");
const app          = express();
const cookieSession = require('cookie-session')

const knexConfig  = require("./knexfile");

const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Separated Routes for each Resource
const routes = require("./routes/routes");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

// handle cookies
app.use(cookieSession({
  name: 'session',
  secret: "Is this really a secret? r7waWquFqMlHIkyGcUBNWrO79cldGsLggM93fKmpaDg=",
  // Cookie Options
  maxAge: 1 * 60 * 60 * 1000 // 1 hour
}));

app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mount all resource routes
app.use("/", routes(knex));

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
