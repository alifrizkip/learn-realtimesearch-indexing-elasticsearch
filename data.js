// import { Client } from 'elasticsearch';

const { Client } = require('elasticsearch');

// Check elasticsearch connection by ping
const client = new Client({
  hosts: ['http://localhost:9200'],
});
client.ping({
  requestTimeout: 30000,
}, (err) => {
  if (err) {
    console.error('Elasticsearch cluster is down!');
  } else {
    console.log('Everything is ok');
  }
});

// Create new index
client.indices.create({
  index: 'scotch.io-tutorial',
}, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Created a new index', res);
  }
});

// Add data to index
client.index({
  index: 'scotch.io-tutorial',
  id: '1',
  type: 'cities_list',
  body: {
    Key1: 'Content for key one',
    Key2: 'Content for key two',
    key3: 'Content for key three',
  },
}, (err, res) => {
  console.log(res);
});


// Bulk insert cities.json
const cities = require('./cities.json');

const bulk = [];

cities.forEach((city) => {
  bulk.push({
    index: {
      _index: 'scotch.io-tutorial',
      _type: 'cities_list',
    },
  });

  bulk.push(city);
});

// Perform bulk indexing
client.bulk({
  body: bulk,
}, (err) => {
  if (err) {
    console.log('Failed bulk operation'.red, err);
  } else {
    console.log('Successfully imported %s'.green, cities.length);
  }
});
