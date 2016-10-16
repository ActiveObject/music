import React from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import vk from 'app/shared/vk';
import { hasTag } from 'app/shared/Tag';
import UserProfile from './UserProfile';

class FetchUser extends React.Component {
  state = {
    isLoading: false,
    user: {}
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    vk.users.get({
      user_ids: this.props.id,
      fields: ['photo_50']
    }, (err, result) => {
      if (err) {
        return console.log(err);
      }

      this.setState({
        isLoading: false,
        user: {
          photo50: result.response[0].photo_50,
          firstName: result.response[0].first_name,
          lastName: result.response[0].last_name
        }
      });
    });
  }

  render() {
    return this.props.children(this.state);
  }
}

const UserProfileCtrl = ({ userId }) =>
  <FetchUser id={userId}>
    {({ isLoading, user }) =>
      <Motion
        defaultStyle={{
          opacity: 0,
          rotate: 50,
          zoom: 80
        }}

        style={{
          opacity: spring(isLoading ? 0 : 100, { stiffness: 160, damping: 50 }),
          rotate: spring(isLoading ? 30 : 0, { stiffness: 150, damping: 30 }),
          zoom: spring(isLoading ? 80 : 100)
        }}>
        {interpolated =>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 30px'}}>
            <UserProfile user={user} opacity={interpolated.opacity / 100} rotationAngle={interpolated.rotate} zoom={interpolated.zoom / 100} />
          </div>
        }
      </Motion>
    }
  </FetchUser>

export default connect(state => ({ userId: state[':app/userId'] }))(UserProfileCtrl);
