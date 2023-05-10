class Route {
  static async execute(req, res, cb) {
    try {
      return await cb(req, res);
    } catch (err) {
      console.warn(err);
      if (err.response) {
        return res
          .status(err.response.data.code)
          .send({ status: "error", message: err.response.data.message });
      }

      return res.status(403).send({ status: "error", err });
    }
  }
}

module.exports = Route;
