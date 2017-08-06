const fs = require('fs');
const _ = require('lodash');

let beers = require('../data/beers.json');

const outputFilename = '../data/ingredients.json'

console.log(`${beers.length} beers loaded in`);

let ingredients = {
  malt: {},
  hops: {},
  yeast: {}
};

_.forEach(['malt', 'hops'], function(ingredient) {
  _.forEach(beers, function(beer) {
    _.forEach(beer.ingredients[ingredient], function(ing) {
      var ingredientName = ing.name
      if(ingredients[ingredient][ingredientName]) {
        ingredients[ingredient][ingredientName].push(beer.id);
      } else {
        ingredients[ingredient][ingredientName] = [beer.id];
      }
    });
  });
});

// aggregat yeast differently as it's not neasted like malt and hops
_.forEach(beers, function(beer) {
  var yeastName = beer.ingredients.yeast;
  if(ingredients.yeast[yeastName]) {
    ingredients.yeast[yeastName].push(beer.id);
  } else {
    ingredients.yeast[yeastName] = [beer.id];
  }
});

// save to file
fs.writeFile(outputFilename, JSON.stringify(ingredients, null, 2), (err) => {
  if (err) {
    console.error(err);
    return;
  };
  const nMalts = Object.keys(ingredients.malt).length;
  const nHops = Object.keys(ingredients.hops).length;
  const nYeasts = Object.keys(ingredients.yeast).length;

  console.log(`${nMalts} malts, ${nHops} hops and ${nYeasts} yeasts written to ${outputFilename}`);
});
