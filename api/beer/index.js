var express = require('express');
const controller = require('./beer.controller.js')

let router = express.Router()

router.get('/', controller.index);
router.get('/:beerID', controller.show);
router.get('/:beerID/similar', controller.showSimilar);

module.exports = router;
