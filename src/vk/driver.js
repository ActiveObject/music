import { hasTag } from 'app/Tag';
import onValue from 'app/fn/onValue';
import vk from 'app/vk';

export default function (vbus) {
  return onValue(vbus.filter(v => hasTag(v, ':user/authenticated')), user => vk.authorize(user));
}
