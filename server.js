var express = require('express');
var fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 8;
const urlDB = process.env.DB || 'mongodb+srv://ubersaw:ubersaw123@cluster-naoru.mongodb.net/anima_app?retryWrites=true&w=majority';
app = express();
port = process.env.PORT || 8888;



app.post('/newUser', function(req, res) {

 
  mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true}, function(error) {
    // if error is truthy, the initial connection failed.
    bcrypt.hash(req.query.password, saltRounds, function(err, hash) {
      if (error) console.log(error);
      var User = mongoose.model('User', new mongoose.Schema({username: 'string', password: 'string' }));
      var newUser = new User({username: req.query.username, password: hash });
      newUser.save(function (err) {
        if (err) return error;
      });
    });
  });
  
});
app.get('/login', function(req, res) {
  
  console.log('Login')
  // console.log(req);
  console.log(urlDB);
  mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true}, function(error) {
    // if error is truthy, the initial connection failed.
    
  })

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    console.log('connected');
  });
});

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });

app.listen(port);

console.log('API anima started on: ' + port);


