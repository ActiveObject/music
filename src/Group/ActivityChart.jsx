import React from 'react';

class ActivityChart extends React.Component {
  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    var { size, margin, weeks } = this.props;
    var w = size * weeks + margin * (weeks - 1);
    var h = size * 7 + margin * 6;

    return <canvas ref='canvas' width={w} height={h} />;
  }

  draw() {
    var { value, size, margin, weeks } = this.props;
    var ctx = this.refs.canvas.getContext('2d');
    var now = Date.now();
    var weekday = new Date(now).getDay();

    for (var i = weeks - 1; i >= 0; i--) {
      for (var j = 0; j < 7; j++) {
        var day = j === 6 ? 0 : j + 1;
        if (i !== 0 || j < weekday) {
          var d = new Date(now - ((i * 7) + j) * 24 * 60 * 60 * 1000);
          var key = [d.getFullYear(), d.getMonth(), d.getDate()].join('-');

          if (value[key]) {
            ctx.fillStyle = fillColor(value[key]);
            ctx.fillRect((size + margin) * (weeks - i - 1), (size + margin) * j, size, size);
          } else {
            var x = (size + margin) * (weeks - i - 1) + size / 2;
            var y = (size + margin) * j + size / 2;

            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.arc(x, y, 2, 0, Math.PI*2, false);
            ctx.fill();
          }
        }
      }
    }

  }
}

function fillColor(n) {
  if (!n) {
    // return 'rgb(129, 132, 204)';
    // return 'rgba(0,0,0,0.05)';
    return 'rgba(0,0,0,0)';
  }

  return 'rgb(91, 95, 176)';
}

export default ActivityChart;
