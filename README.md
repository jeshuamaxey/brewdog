# Brew Dog

I discovered Brew Dog has [an API for its beers](https://punkapi.com/). Without knowing what to build I scraped it and messed around with the data, building a limited API to search for relationships between beers.

## Setup

This is built in node.js. I assume you have node, npm and nvm installed.

After cloning the repo, from the root:

1. Set the version of node
1. Install dependencies
1. Start up the server

```bash
nvm use
npm i
node app.js
```

## API docs

## `/api/beers`

**Returns:** A list of all beers.

**Supported requests:** `GET`.

## `/api/beers/:beerID`

**Returns:** A single beer, specified by the URL parameter `beerID`

**Supported requests:** `GET`.

## `/api/beers/:beerID/similar`

**Returns:** A list of similar beers to the beer specified by the `beerID` URL parameter.

**Supported requests:** `GET`.

|Param name|Required|Type|Default value|Possible values|Description|
|---|---|---|---|---|---|
|`sameHops`|No|Integer|`0`|`0`, `1`|When set to true, the search will encompass beers brewed with the same hops as the specified beer.|
|`sameMalt`|No|Integer|`0`|`0`, `1`|When set to true, the search will encompass beers brewed with the same malt as the specified beer.|
|`sameYeast`|No|Integer|`0`|`0`, `1`|When set to true, the search will encompass beers brewed with the same yeast as the specified beer.|
|`filterLogic`|No|String|`'OR'`|`'OR'`, `'AND'`|When set to `'OR'`, the search will return beers which match any of the individual filter criteria. When set to `'AND'`, the search will return beers which only match all of the individual filter criteria|

## Scraping and wrangling data

Inside the `utils` directory are scripts to handle the beer data.

|Script|Description|Output|
|---|---|---|
|`utils/scrape-bd.js`|scrapes the brew dog API for beer info.|`data/beers.json`|
|`utils/extract-food-pairings.js`|Aggregates food pairings adding relevant beer IDs.|`data/food-pairings.json`|
|`utils/extract-ingredients.js`|Aggregates ingredients adding relevant beer IDs.|`data/ingredients.json`|
