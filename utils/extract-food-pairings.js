const fs = require('fs');
const _ = require('lodash');

let beers = require('../data/beers.json');

const outputFilename = '../data/food-pairings.json'

console.log(`${beers.length} beers loaded in`);

let foodPairings = {};

_.forEach(beers, function(beer) {
  _.forEach(beer.food_pairing, function(fp) {
    if(foodPairings[fp]) {
      foodPairings[fp].push(beer.id);
    } else {
      foodPairings[fp] = [beer.id];
    }
  });
});

// save to file
fs.writeFile(outputFilename, JSON.stringify(foodPairings, null, 2), (err) => {
  if (err) {
    console.error(err);
    return;
  };
  console.log(`${Object.keys(foodPairings).length} pairings written to ${outputFilename}`);
});
