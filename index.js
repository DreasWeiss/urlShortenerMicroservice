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

app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urlShortenerList = [];

app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  const shortUrl = urlShortenerList.length + 1;
  const regex = /^https?:\/\/(www.)?[a-z0-9]*.[a-z0-9]*/i;

  if (regex.exec(url)){
    dns.lookup(url.replace(/^https?:\/\//i, ''), (err) => {
      if (err) {
        res.json({ error: 'invalid url' });
      } else {
        urlShortenerList.push({
          original_url : req.body.url , short_url : shortUrl
        });
        res.json({
          original_url : req.body.url , short_url : shortUrl
        });
      }
    });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:new', (req, res) => {
  let testShortUrl = req.params.new;
  let urlIndex = urlShortenerList.findIndex(i => i.short_url == testShortUrl);
  if (urlIndex >= 0){
    res.redirect(urlShortenerList[urlIndex].original_url);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
