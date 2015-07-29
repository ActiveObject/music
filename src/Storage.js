import system from 'app';

export let IGetItem = Symbol('IGetItem');
export let ISetItem = Symbol('ISetItem');

export function getItem(key, fn) {
  return system[IGetItem](key, fn);
}

export function setItem(item) {
  return system[ISetItem](item);
}