var db = require('app/db');

module.exports = db
  .map(v => v.get(':db/layout'))
  .skipDuplicates();
