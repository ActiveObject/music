module.exports = function (receive, send) {
  if (localStorage.hasOwnProperty(':player/track')) {
    send({
      e: 'app/player',
      a: ':player/track',
      v: JSON.parse(localStorage.getItem(':player/track'))
    });
  }

  receive(':player/track', function (appstate, track) {
    localStorage.setItem(':player/track', JSON.stringify(track));
  });
};