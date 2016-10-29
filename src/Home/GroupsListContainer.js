import React from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import difference from 'lodash/difference';
import vk from 'app/shared/vk';

class GroupsListContainer extends React.Component {
  state = {
    cache: Map(),
    usage: Map()
  }

  componentWillMount() {
    this.setState({
      cache: Map(JSON.parse(localStorage.getItem(':cache/groups')))
    });

    this.setState({
      usage: Map(JSON.parse(localStorage.getItem(':cache/groups-usage')))
    });
  }

  render() {
    var groups = this.props.groups.sort(compareByUsage(this.state.usage));

    return (
      <Tracker value={this.state.usage} onChange={c => this.updateUsage(c)}>
        <GroupSync cache={this.state.cache} onSync={c => this.updateCache(c)}>
          <div className='groups-list'>
            {this.props.children(groups)}
          </div>
        </GroupSync>
      </Tracker>
    )
  }

  updateCache(cache) {
    this.setState({ cache });
    localStorage.setItem(':cache/groups', JSON.stringify(cache));
  }

  updateUsage(usage) {
    this.setState({ usage });
    localStorage.setItem(':cache/groups-usage', JSON.stringify(usage));
  }
}

function compareByUsage(usage) {
  function usageOf(id) {
    return usage.has(id) ? usage.get(id) : 0;
  }

  return function (a, b) {
    return usageOf(b) - usageOf(a);
  };
}

class Tracker extends React.Component {
  render() {
    return (
      <div onClick={e => this.track(e)}>
        {this.props.children}
      </div>
    );
  }

  track(e) {
    var key = e.target.dataset.trackKey;

    if (key) {
      this.props.onChange(this.props.value.update(key, 0, v => v + 1));
    }
  }
}

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
    var idsInUse = this.props.groups;
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

export default GroupsListContainer;
