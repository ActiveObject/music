import { EventEmitter } from 'events';

var vbus = new EventEmitter();

vbus.push = function (v) {
  vbus.emit('value', v);
};

export default vbus;

