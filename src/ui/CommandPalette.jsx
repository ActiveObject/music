import React from 'react';

export default React.createClass({
  render: function () {
    return (
      <div className='command-palette' style={this.props.style} >
        <input
          type='text'
          className='command-palette__input'
          value={this.props.command}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange} />
      </div>
    );
  }
});
