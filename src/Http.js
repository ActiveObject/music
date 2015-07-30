import system from 'app'

export let IHttpRequest = Symbol('IHttpRequest');

export function request(url, callback) {
  return system[IHttpRequest](url, callback);
}