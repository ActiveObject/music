import onValue from 'app/fn/onValue';

export default function subscribeWith(subscriber) {
  var subs = [];

  subscriber(function (...args) {
    subs.push(onValue(...args));
  });

  return function () {
    subs.forEach(function (unsubscribe) {
      unsubscribe();
    });
  };
}