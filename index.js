require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
// const mongodb = require('mongodb');
// const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: true }));

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let links = [];
let id = 0;

app.post('/api/shorturl', (req, res) => {
  const {url} = req.body;
  console.log(url);
  const regex = /^https?:\/\/[0-9a-z]*/i;

  if (!regex.exec(url)){
    return res.json({ error: 'invalid url' });
  } else {
    dns.lookup(url.replace(/^https?:\/\//i, ''), (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      id++;
      let link = {
        original_url : url, 
        short_url : id-1
      };
    
      links.push(link);
    
      res.json(link);
    }
  });
  }
});

// app.get('/api/shorturl/:id', (req, res) => {
//   // const {id} = req.params;
//   // const link = links.find(l=>l.short_url === `${id}`);

//   // if(link){
//   //   return res.redirect(link.original_url);
//   // } else {
//   //   return res.json({
//   //     error: 'No short url'
//   //   });
//   // }
// });



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
