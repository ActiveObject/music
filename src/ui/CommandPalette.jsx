import React from 'react';

export default React.createClass({
  render: function () {
    return (
      <div className='command-palette' style={this.props.style} >
        <input
          type='text'
          className='command-palette__input'
          value={this.props.cmd}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChange={(e) => this.props.onChange(e.target.value)} />
      </div>
    );
  }
});
