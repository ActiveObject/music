function View(render) {
  this.children = [];
  this.render = render;
}

View.prototype.child = function (render) {
  this.children.push(new View(render));
};

View.prototype.layout = function (appstate) {
  return this.render(appstate, this.children.map(function(child) {
    return child.layout(appstate);
  }));
};

module.exports = View;