const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200'],
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

client.ping({
  requestTimeout: 30000,
}, (err) => {
  if (err) {
    console.error('Elasticsearch cluster is down');
  } else {
    console.log('Everything is ok');
  }
});

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.sendfile('template.html', {
    root: path.join(__dirname, 'views'),
  });
});

app.get('/v2', (req, res) => {
  res.sendFile('template2.html', {
    root: path.join(__dirname, 'views'),
  });
});

app.get('/search', (req, res) => {
  const body = {
    size: 200,
    from: 0,
    query: {
      match: {
        name: req.query.q,
      },
    },
  };

  client.search({
    index: 'scotch.io-tutorial',
    body,
    type: 'cities_list',
  })
    .then(result => res.send(result.hits.hits))
    .catch((err) => {
      console.log(err);
      res.send([]);
    });
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ', app.get('port'));
});
