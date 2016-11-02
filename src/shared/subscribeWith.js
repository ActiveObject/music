import onValue from 'app/shared/onValue';

export default function subscribeWith(...fns) {
  var subs = [];
  var subscriber = fns[fns.length - 1];
  var wrapped = fns.slice(0, -1).map(function (fn) {
    return function (...args) {
      subs.push(fn(...args));
    };
  });

  subscriber(...wrapped);

  return function () {
    subs.forEach(function (unsubscribe) {
      unsubscribe();
    });
  };
}