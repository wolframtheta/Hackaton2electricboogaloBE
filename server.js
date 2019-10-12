var express = require('express');
var fs = require('fs');
app = express();
port = process.env.PORT || 8888;

app.get('/magia', function(req, res) {
  console.log('Magia')
  fs.readFile('data/magia.json', 'utf-8', function(err, data) {

    res.send(data);
  });
});

app.get('/ki', function(req, res) {
  console.log('Ki')
  fs.readFile('data/ki.json', 'utf-8', function(err, data) {

    res.send(data);
    console.log(data);
  });
});

app.get('/mentalismo', function(req, res) {
  console.log('Mentalismo')
  fs.readFile('data/mentalismo.json', 'utf-8', function(err, data) {

    res.send(data);
  });
});

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });

app.listen(port);

console.log('API anima started on: ' + port);


