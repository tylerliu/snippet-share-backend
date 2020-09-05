let {getToken, signUp} = require("../models/AuthModel");

let express = require('express');
let router = express.Router();

/* GET users login page */
router.get('/login', function(req, res, next) {
  let redirect = null
  if (req.query.redirect !== undefined) {
    redirect = req.query.redirect
  }
  res.render('login', {redirect: redirect, username: "", alert_message: null})
});

/* GET users sign up page */
router.get('/register', function(req, res, next) {
  let redirect = null
  if (req.query.redirect !== undefined) {
    redirect = req.query.redirect
  }
  res.render('register', {redirect: redirect, username: "", alert_message: null})
});

/* GET users login page */
router.post('/login', function(req, res, next) {
  let redirect = null
  if (req.body.redirect !== undefined) {
    redirect = req.body.redirect
  }

  getToken(req.body.username, req.body.password)
      .then((token) => {
        if (token !== null) {
          res.cookie('jwt', token)
          if (redirect) {
            res.redirect(redirect)
          } else {
            res.status(200)
            res.send("the authentication was successful!")
          }
        } else throw new Error("Null token");
      }).catch((err) => {
        if (err.message === "Unauthorized") {
          res.status(401);
          res.render('login', {
            redirect: redirect,
            username: req.body.username,
            alert_message: "Your username or password cannot be found. Please try again"
          })
        } else {
          next(err);
        }
      })
});

/* GET users sign up page */
router.post('/register', function(req, res, next) {
  let redirect = null
  if (req.body.redirect !== undefined) {
    redirect = req.body.redirect
  }

  signUp(req.body.username, req.body.password)
      .then((result) => {
        if (result) {
          if (redirect) {
            res.redirect(`/account/login?redirect=${redirect}`)
          } else {
            res.status(200)
            res.send("The register was successful!")
          }
        } else throw new Error("Failed register");
      }).catch((err) => {
        if (err.message === "User Exists") {
          res.status(401);
          res.render('register', {
            redirect: redirect,
            username: req.body.username,
            alert_message: "Your username is being registered already. Try a different username. "
          })
        } else {
          next(err);
        }
      })
});

module.exports = router;
