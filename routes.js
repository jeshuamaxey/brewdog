module.exports = function(app) {
  app.use('/api/beers', require('./api/beer'));

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
