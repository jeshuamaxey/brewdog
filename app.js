const express = require('express');
const _ = require('lodash');

let app = express();

app.set('PORT', process.env.PORT || 3000);
app.set('appPath', __dirname + '/public')

require('./routes')(app);

app.listen(app.get('PORT'), function() {
  console.log(`App available at http://localhost:${app.get('PORT')}`);
});
