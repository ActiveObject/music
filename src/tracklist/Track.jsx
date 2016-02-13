import cx from 'classnames';
import './track.css';

const Track = ({ track, index, isActive = false, onTogglePlay }) =>
  <div className={ cx({ 'track': true, 'track--active': isActive }) } onClick={ () => onTogglePlay(track) }>
    <div className='track__index'>{index}</div>
    <div className='track__artist'>{track.artist}</div>
    <div className='track__title'>{track.title}</div>
    <div className='track__duration'>{duration(track.duration)}</div>
  </div>

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function duration(s) {
  if (s < 60) {
    return `00:${pad(s)}`;
  }

  if (s < 60 * 60) {
    let mm = pad(Math.floor(s / 60));
    let ss = pad(s % 60);

    return `${mm}:${ss}`;
  }

  if (s < 60 * 60 * 60) {
    let hh = pad(Math.floor(s / 3600));
    let mm = pad(Math.floor((s % 3600) / 60));
    let ss = pad(s % 3600 % 60);

    return `${hh}:${mm}:${ss}`;
  }
}

export default Track;
