import React from 'react';
import difference from 'lodash/difference';
import app from 'app';
import vk from 'app/vk';
import merge from 'app/shared/merge';
import { updateOn } from 'app/StartApp';

class GroupSync extends React.Component {
  componentWillMount() {
    this.sync();
  }

  componentDidUpdate() {
    this.sync();
  }

  render() {
    return this.props.children;
  }

  sync() {
    var idsInUse = app.value.get(':db/groups');
    var idsInCache = [...this.props.cache.keys()];

    var outdated = difference(idsInCache, idsInUse);
    var missing = difference(idsInUse, idsInCache);

    console.log(`[GroupSync] ${missing.length} missing, ${outdated.length} outdated`);

    if (missing.length > 0) {
      vk.groups.getById({
        group_ids: missing.slice(0, 100).join(',')
      }, (err, res) => {
        if (err) {
          return console.log(err);
        }

        var cache = res.response.reduce((c, g) => c.set(String(g.id), g), this.props.cache);

        this.props.onSync(cache);
      });
    }
  }
}

GroupSync.propTypes = {
  cache: React.PropTypes.object.isRequired,
  onSync: React.PropTypes.func.isRequired
};

export default updateOn(GroupSync, ':db/groups');
