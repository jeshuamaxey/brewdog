const fs = require('fs');

const request = require('request');
const queryString = require('query-string');
const Q = require('q');

const baseURL = 'https://api.punkapi.com/v2/beers';
const outputFilename = 'beers.json';
const maxItemsPerRequest = 80;

function getBeers(page, allBeers) {
  const deferred = Q.defer();

  allBeers = allBeers || [];
  let query = {
    'page': page || 1,
    'per_page': maxItemsPerRequest
  };
  let encodedQuery = queryString.stringify(query);
  let url = `${baseURL}?${encodedQuery}`;

  console.log(`req #${query.page}\tGET: ${url}`);

  request(url, function(error, response, body) {
    if(error) {
      console.log('ERROR!');
      return deferred.reject(error);
    }

    let beers = JSON.parse(body);
    console.log(`${beers.length} beers returned`);
    allBeers = allBeers.concat(beers);

    // if we maxed out on beer...
    if (beers.length === maxItemsPerRequest) {
      // call API again with inc. page
      deferred.resolve(getBeers(query.page+1, allBeers));
    } else {
      // otherwise resolve with all the beers
      deferred.resolve(allBeers);
    }
  });

  return deferred.promise;
}

getBeers()
.then(function(beers) {
  // save to file
  fs.writeFile(outputFilename, JSON.stringify(beers, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log(`${beers.length} beers written to ${outputFilename}`);
  });
});
