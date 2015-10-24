import { extend } from 'underscore';

export default function merge(...objs) {
  return extend({}, ...objs);
}
