var express = require('express');
var fs = require('fs');
const mongoose = require('mongoose');

const urlDB = process.env.DB || 'mongodb+srv://ubersaw:ubersaw123@cluster-naoru.mongodb.net/test?retryWrites=true&w=majority';
app = express();
port = process.env.PORT || 8888;

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


