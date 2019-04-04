const router = require('express').Router();
const bcrypt = require('bcrypt');
const saveTokens = require('../db/userTokens.db');
const saveUser = require('../db/user.db');

function checkAuth(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) return next();
  res.json({ error: 'notLoggedIn', status: res.statusCode });
}

router
  .route('/')
  .get(checkAuth, (req, res) => {
    res.send(req.user);
  })
  .post((req, res) => {
    console.log(JSON.stringify(req.body));
    let id = req.body.uid;
    console.log("randommmmmm", req.body);
    console.log(typeof id);
    saveTokens
      .findUser(id)
      .then(response => {
        let act = response.payload.accessToken;
        bcrypt.compare(act, req.body.hoken, function(err, response) {
          if (response) {
            saveUser
              .retrieveUser(id)
              .then(response => {
                res.json({
                  payload: response.payload
                });
              })
              .catch(error => {
                res.status(500).json({
                  error: true,
                  message: error.message
                });
              });
          }
        });
      })
      .catch(err => console.log(err.message));
  });

module.exports = router;
