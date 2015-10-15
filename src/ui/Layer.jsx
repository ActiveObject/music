import merge from 'app/fn/merge';

class Layer extends React.Component {
  render() {
    var style = merge({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }, this.props.style);

    return (
      <div className={this.props.className} style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default Layer;