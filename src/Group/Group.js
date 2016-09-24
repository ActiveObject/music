import React from 'react';
import vk from 'app/shared/vk';
import MediaQuery from 'react-responsive';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import GroupProfile from './GroupProfile';
import GroupProfilePreview from './GroupProfilePreview';
import GroupTop5Tracks from './GroupTop5Tracks';
import GroupActivity from './GroupActivity';
import 'app/shared/ResponsiveGrid.css';

class Group extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentWillMount() {
    var cachedGroups = JSON.parse(localStorage.getItem(':cache/groups'));

    if (cachedGroups && cachedGroups[this.props.params.id]) {
      this.setState({
        group: cachedGroups[this.props.params.id]
      });
    } else {
      this.setState({ isLoading: true });

      vk.groups.getById({
        group_ids: this.props.params.id,
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
    return (
      <div className='Group'>
        <div className='scroll-container'>
          <div className='section'>
            <GroupProfilePreview isActive={this.state.isLoading}>
              <GroupProfile group={this.state.group} />
            </GroupProfilePreview>
          </div>

          <MediaQuery minAspectRatio='2/3'>
            <div className='section'>
              <GroupActivity groupId={this.props.params.id} />
            </div>
          </MediaQuery>

          <div className='section Group__content'>
            <div className='content'>
              <div className='header'>Week top</div>
              <GroupTop5Tracks groupId={this.props.params.id} />
            </div>
          </div>
        </div>

        <PlayBtnCtrl />
      </div>
    )
  }
}

export default Group;
