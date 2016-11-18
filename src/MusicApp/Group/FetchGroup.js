import React from 'react';
import vk from 'app/shared/vk';
import EffectComponent from 'app/shared/EffectComponent';

export default class FetchGroup extends EffectComponent {
  state = {
    isLoading: false
  }

  componentWillMount() {
    var cachedGroups = JSON.parse(localStorage.getItem(':cache/groups'));

    if (cachedGroups && cachedGroups[this.props.id]) {
      this.setState({
        group: cachedGroups[this.props.id]
      });
    } else {
      this.setState({ isLoading: true });

      var effect = vk.groups.getById({
        group_ids: this.props.id,
        fields: ['description']
      }, (err, res) => {
        if (err) {
          return console.log(err);
        }

        this.setState({
          isLoading: false,
          group: res.response[0]
        });
      });

      this.perform(effect);
    }
  }

  render() {
    return this.props.children(this.state);
  }
}
