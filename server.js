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
var Spells = mongoose.model('magia_spells', new mongoose.Schema({nombre: 'string', }));
//var Pnjspells = mongoose.model('magia_spells', new mongoose.Schema({idusuario: 'integer', idpj : 'string'}));
var Characters = mongoose.model('characters',new mongoose.Schema({nombre: 'string',}));


app.post('/newUser', function(req, res) {

    // if error is truthy, the initial connection failed.
    bcrypt.hash(req.query.password, saltRounds, function(error, hash) {
      if (error) throw error;
      var newUser = new User({username: req.query.username, password: hash });
      newUser.save(function (err2) {
        if (err2) throw err2;
        return res.send();
      });
    });
  
});

app.get('/personaje', function(req, res) {

  console.log('Players of user')
    
  Characters.find({'nombre': req.query.nombre},function(err, characters) {
    return res.send(characters);  
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

app.get('/all_spells', function(req, res) {

  console.log('All spells')
    
  Spells.find({}, function(err, spells) {
    return res.send(spells);  
  });
});

app.get('/player_spells', function(req, res) {

  console.log('Player spells')
    
  Pnjspells.find({'userid': req.query.userid},{'pnjid': req.query.pnjid}, function(err, pnjspells) {
    return res.send(pnjspells);  
  });
});


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });

app.listen(port);

console.log('API anima started on: ' + port);


