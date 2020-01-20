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
var Spells = mongoose.model('magia_spells', new mongoose.Schema({nombre: 'string', nivel: 'number'}));
//var Pnjspells = mongoose.model('magia_spells', new mongoose.Schema({idusuario: 'integer', idpj : 'string'}));
var Characters = mongoose.model('characters',new mongoose.Schema({id: 'number',}));


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

app.get('/characters', function(req, res) {

  console.log('Players of user ' + req.query.id)
    
  Characters.findOne({'id': req.query.id } ,function(err, character) {
    return res.send(character);  
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

app.get('/spells', async function(req, res) {
  console.log(req.query)
  let spells = [];
  switch (req.query.orderBy) {
    case 'nombre':
      spells = await Spells.find({via: req.query.path});
      spells.sort(function (a, b) {
        if (req.query.direction === 'asc')
          return a.nombre.localeCompare(b.nombre);
        else if (req.query.direction === 'desc')
          return b.nombre.localeCompare(a.nombre);
      });
      break;
    case 'nivel':
      spells = await Spells.find({via: req.query.path}).sort({ nivel : req.query.direction });
      break;
    default:
        spells = await Spells.find({via: req.query.path}).sort({ nivel : 'asc'});
      break;
  }
  return res.send(spells);
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


