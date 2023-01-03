require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
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

const urlShortenerList = [
  {
    "original_url": 'www.google.com',
    "short_url": 1
  },
  {
    "original_url": 'www.abc.com',
    "short_url": 2
  },
  {
    "original_url": 'www.ya.ru',
    "short_url": 3
  },

];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const shortUrl = urlShortenerList.length + 1;

  dns.lookup(url, (err, value) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      urlShortenerList.push({
        "original_url": url,
        "short_url": shortUrl
      });
      console.log(urlShortenerList);
      res.json({
        "original_url": url,
        "short_url": shortUrl
      });
    }
  });
});

app.get('/api/shorturl/:new', (req, res) => {
  let testShortUrl = req.params.new;
  console.log(urlShortenerList);
  let urlIndex = urlShortenerList.findIndex(i => i.short_url == testShortUrl);
  console.log(urlIndex);
  if (urlIndex >= 0){
    res.redirect(`https://${urlShortenerList[urlIndex].original_url}`);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
