var express = require('express');
var fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS || 8;
const urlDB = process.env.DB || 'mongodb+srv://ubersaw:ubersaw123@cluster-naoru.mongodb.net/anima_app?retryWrites=true&w=majority';
app = express();
app.use(cors());
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});
port = process.env.PORT || 8888;

var User = mongoose.model('User', new mongoose.Schema({username: 'string', password: 'string' }));


app.post('/newUser', function(req, res) {

    // if error is truthy, the initial connection failed.
    bcrypt.hash(req.query.password, saltRounds, function(error, hash) {
      if (error) throw error;
      var newUser = new User({username: req.query.username, password: hash });
      newUser.save(function (err2) {
        if (err2) throw err2;
      });
    });
  
});


app.get('/login', function(req, res) {

  console.log('Login')
    
  User.findOne({'username': req.query.username}, 'username password', function(err, user) {
    console.log
    if (!user) {
      console.log('login_ko');
      return res.send('login_ko');
    }
    bcrypt.compare(req.query.password, user.password, function(err2, res2) {
      if (err2) throw err2;
      if (res2) {console.log('login_ok'); return res.send('login_ok');}
      else {console.log('login_ko'); return res.send('login_ko');}
    });

  });
});

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });

app.listen(port);

console.log('API anima started on: ' + port);


