import React from 'react';

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

export default Tracker;
