import React from 'react';
import vk from 'app/shared/vk';

export default class FetchGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentWillMount() {
    var cachedGroups = JSON.parse(localStorage.getItem(':cache/groups'));

    if (cachedGroups && cachedGroups[this.props.id]) {
      this.setState({
        group: cachedGroups[this.props.id]
      });
    } else {
      this.setState({ isLoading: true });

      vk.groups.getById({
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
    }
  }

  render() {
    return this.props.children(this.state);
  }
}
