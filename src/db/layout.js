var db = require('app/db');

module.exports = db.changes
  .map(v => v.get(':db/layout'))
  .skipDuplicates();
