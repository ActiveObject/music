import merge from 'app/shared/merge';

function Layer({ style, className, children }) {
  var layerStyle = merge({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  }, style);

  return (
    <div className={className} style={layerStyle}>
      {children}
    </div>
  );
}

export default Layer;
