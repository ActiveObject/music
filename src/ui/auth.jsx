var React = require('react');
var Icon = require('app/ui/icon');

var Auth = React.createClass({
  render: function () {
    return (
      <div className='auth'>
        <a className='element-link auth-link' href={this.props.url}>
          <div className='auth-bg-circle'>
            <Icon id='shape-vkcom' className='auth-vk-icon' />
            <div className='auth-vk-desc'>{'login wiht vk'}</div>
          </div>
        </a>
      </div>
    );
  }
});

module.exports = Auth;