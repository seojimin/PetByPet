const HTTP_PORT = process.env.PORT || 5000;

const dataService = require("./data-service.js");
const dataServiceAuth = require("./data-service-auth.js");
const bodyParser = require("body-parser");
const express = require("express"); //Node.js web app framework
const app = express();
const clientSessions = require("client-sessions");

const onServerStart = () => {
  console.log("Express http server listening on " + HTTP_PORT);
};

app.use(
  clientSessions({
    cookieName: "session",
    secret: "thisisaverylongandunguessablepassword",
    duration: 5 * 60 * 1000,
    activeDuration: 1000 * 60
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const ensureLogin = (req, res, next) => {
  if (!req.session.user) res.redirect("/login");
  next();
};

app.get("/", function(req, res) {
  res.send("PetByPet");
});

app.get("/customers", function(req, res) {
  dataService
    .getAllCustomers()
    .then(data => res.json(data))
    .catch(err => console.log(err));
});

//Run this on ALL requests
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(404).send("Error");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.post("/customers/add", ensureLogin, function(req, res) {
  console.log(req.body);
  dataService
    .addCustomer(req.body)
    .then(res.redirect("/customers"))
    .catch(err => console.log(err));
});

app.post("/customers/update", function(req, res) {
  let newCustomerData = req.body;

  dataService
    .updateCustomer(newCustomerData)
    .then(data => res.redirect("/customers"))
    .catch(err => res.status(500).send("error occurred"));
});

dataService
  .initialize()
  .then(
    dataServiceAuth
      .initialize()
      .then(() => app.listen(HTTP_PORT, onServerStart))
      .catch("Unable to start auth")
  )
  .catch(err => `unable to start server ${err}`);

app.get("/customers/:value", function(req, res) {
  let number = req.params.value;
  console.log(number);
  dataService
    .getCustomerByNum(number)
    .then(data => res.json(data))
    .catch(err => console.log(err));
});

app.delete("/customers/delete/:cusNum", function(req, res) {
  let cusNum = req.params.cusNum;
  dataService
    .deleteCustomerByNum(cusNum)
    .then(() => res.redirect("/customers"))
    .catch(() =>
      res.status(500).send("Unable to Remove Customer / Customer not found")
    );
});

app.get("/login", (req, res) => {
  res.send("login");
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  dataServiceAuth
    .checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect("/customers");
    })
    .catch(err => res.send(err));
});

app.get("/register", (req, res) => {
  res.send("register");
});

app.post("/register", (req, res) => {
  dataServiceAuth
    .registerUser(req.body)
    .then(() => res.send("User created"))
    .catch(err => res.send(err));
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.send(req.session.user.loginHistory);
});
