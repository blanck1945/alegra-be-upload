const chalk = require("chalk");
class Route {
  static async execute(req, res, cb) {
    try {
      await cb(req, res);
    } catch (err) {
      if (err.response) {
        return res
          .status(err.response.data.code)
          .send({ status: "error", message: err.response.data.message });
      }
    }

    console.warn(err);
    return res.status(403).send({ status: "error", err });
  }
}

module.exports = Route;
