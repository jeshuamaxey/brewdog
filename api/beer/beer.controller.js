var _ = require('lodash');

const beers = require('../../data/beers.json');
const ingredients = require('../../data/ingredients.json');

index = function(req, res) {
  res.send(beers);
};

show = function(req, res) {
  const beerID = parseInt(req.params.beerID);
  const beer = _.find(beers, {id: beerID});

  if(beer) {
    return res.send(beer)
  } else {
    return res.status(404).send(`404 - no beer with an ID of ${beerID}`);
  }
};

showSimilar = function(req, res) {
  const beerID = parseInt(req.params.beerID);
  const beer = _.find(beers, {id: beerID});

  // check we have a valid beer
  if(!beer) {
    return res.status(404).send(`404 - no beer with an ID of ${beerID}`);
  }

  function getBeersWithSimilar(ingCategory, ingsToMatch) {
    return _.chain(ingsToMatch)
      .map(function(ingToMatch) {
        return ingredients[ingCategory][ingToMatch.name];
      })
      .flatten()
      .uniq()
      .value();
  }

  console.log(req.query)

  // extract query parameters
  const filterLogic = (req.query.filterLogic || 'OR').toUpperCase();
  const sameHops = Boolean(req.query.sameHops);
  const sameMalt = Boolean(req.query.sameMalt);
  const sameYeast = Boolean(req.query.sameYeast);

  // collect all relevant beer IDs
  let allRelevantBeerIDs = [];

  if(sameHops) {
    let sameHopsBeerIDs = getBeersWithSimilar('hops', beer.ingredients.hops)
    console.log('# sameHopsBeerIDs: ', sameHopsBeerIDs.length);
    allRelevantBeerIDs.push(sameHopsBeerIDs);
  }

  if(sameMalt) {
    let sameMaltBeerIDs = getBeersWithSimilar('malt', beer.ingredients.malt)
    console.log('# sameMaltBeerIDs: ', sameMaltBeerIDs.length);
    allRelevantBeerIDs.push(sameMaltBeerIDs);
  }

  if(sameYeast) {
    let sameYeastBeerIDs = getBeersWithSimilar('yeast', [beer.ingredients.yeast])
    console.log('# sameYeastBeerIDs: ', sameYeastBeerIDs.length);
    allRelevantBeerIDs.push(sameYeastBeerIDs);
  }

  const _combinationMethod = filterLogic === 'AND' ? 'intersection' : 'concat';

  // combine and de-dedupe IDs
  let similarBeerIDs = _.chain()
    [_combinationMethod](...allRelevantBeerIDs)
    .uniq()
    // remove the queried beer from the results and any undefined values
    .tap(function(ids) {
      _.remove(ids, function(id) {
        return _.isUndefined(id) || id === beer.id
      })
    })
    .value();

  console.log('# similarBeerIDs: ', similarBeerIDs.length)

  let similarBeers = _.map(similarBeerIDs, function(id) {
    return _.find(beers, {id: id});
  });

  // package response
  res.send({
    numberOfResults: similarBeers.length,
    results: similarBeers
  });

};

module.exports = {
  index,
  show,
  showSimilar
};

