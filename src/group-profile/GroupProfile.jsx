import React from 'react';
import vk from 'app/vk';
import './GroupProfile.css';

var GroupImage = ({ group }) => (
  <div className='group-image'>
    <img src={group.photo_200} />
  </div>
);

var GroupProfile = ({ group }) => (
  <div className='group-profile'>
    <GroupImage group={group} />
    <span className='group-name'>{group.name}</span>
  </div>
);

class GroupLoader extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    vk.groups.getById({
      group_ids: this.props.group,
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

  render() {
    if (this.state.isLoading) {
      return <div/>;
    }

    return <GroupProfile group={this.state.group} />
  }
}

export default GroupLoader;
