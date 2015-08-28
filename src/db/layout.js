var db = require('app/db');
var Atom = require('app/core/atom');
var layout = new Atom(require('app/routes/empty-route'));

db
  .map(v => v.get(':db/layout'))
  .filter(Boolean)
  .skipDuplicates()
  .onValue(v => Atom.swap(layout, v));

module.exports = layout;