var ISet = require('immutable').Set;
var Atom = require('app/core/atom');
var vbus = require('app/core/vbus');
var tagOf = require('app/utils/tagOf');

var ActivityStore = module.exports = new Atom(ISet());

ActivityStore.forGroup = function (group) {
  var result = new Atom(ActivityStore.value.filter(v => v.owner === -group.id));

  result.unsub = vbus
    .filter(v => tagOf(v) === ':app/activity')
    .map(([tag, v]) => v.filter(item => item.owner === -group.id))
    .onValue(v => Atom.update(result, (a) => a.union(v)));

  return result;
};

vbus
  .filter(v => tagOf(v) === ':app/activity')
  .onValue(([tag, v]) => Atom.update(ActivityStore, (a) => a.union(v)));