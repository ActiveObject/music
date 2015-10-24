import { Map } from 'immutable';

function firstValue(x) {
  return x[Object.keys(x)[0]];
}

export default function revive(key, value) {
  if (key === 'player') {
    return firstValue(value);
  }

  if (key === 'tracks') {
    return Map(value);
  }

  if (key === 'albums') {
    return Map(value);
  }

  return value;
};
