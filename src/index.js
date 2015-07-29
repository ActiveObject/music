let app = {
  use: function (system) {
    Object.setPrototypeOf(this, system)
    return this;
  }
}

export default app
