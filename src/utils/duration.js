function pad(n) {
  return n < 10 ? '0' + n : n;
}

module.exports = function duration(s) {
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
};