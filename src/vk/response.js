function Response(err, data) {
  this.err = err;
  this.data = data;
}

Response.TOO_MANY_REQUESTS = 6;
Response.CAPTCHA_NEEDED = 14;

Response.prototype.send = function(callback) {
  if (this.tooManyRequests() || this.captchaNeeded()) {
    return callback(this.err);
  }

  if (this.err) {
    callback(this.err);
  } else {
    callback(null, this.data);
  }

  return this;
};

Response.prototype.tooManyRequests = function() {
  return this.err && this.err.error_code === Response.TOO_MANY_REQUESTS;
};

Response.prototype.captchaNeeded = function() {
  return this.err && this.err.error_code === Response.CAPTCHA_NEEDED;
};

export default Response;
