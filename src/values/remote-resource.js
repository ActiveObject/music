function RemoteResource(status, data, options) {
  this.status = status;
  this.data = data;
  this.options = options;
}

RemoteResource.is = function (x) {
  return x instanceof RemoteResource;
};

module.exports = RemoteResource;